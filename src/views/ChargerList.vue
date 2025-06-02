<template>
  <div class="charger-list-container">
    <h2>All Charging Stations</h2>

    <!-- Filter UI -->
    <div class="filter-container" style="margin-bottom: 20px;">
      <h3>Filter Chargers</h3>
      <label>
        Status:
        <select v-model="filters.status">
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="out_of_service">Out of Service</option>
        </select>
      </label>

      <label>
        Min Power Output (kW):
        <input type="number" v-model.number="filters.powerOutput" min="0" />
      </label>

      <label>
        Connector Type:
        <input type="text" v-model="filters.connectorType" placeholder="Connector Type" />
      </label>

      <button @click="fetchFilteredChargers">Apply Filters</button>
      <button @click="clearFilters" style="margin-left: 10px;">Clear Filters</button>
    </div>

    <button @click="openModal(null)">Add New</button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Charger' : 'Add New Charger' }}</h3>
        <form @submit.prevent="handleCharger">
          <label>
            Name:
            <input v-model="newCharger.name" required />
          </label>

          <label>
            City (optional):
            <input type="text" v-model="citySearch" @change="geocodeCity"
              placeholder="Enter city name to auto-fill location" />
          </label>

          <label>
            Select Location:
            <div id="location-map" style="height: 300px; margin-top: 10px;"></div>
          </label>
          <p>Selected Coordinates: ({{ newCharger.latitude }}, {{ newCharger.longitude }})</p>


          <label>
            Status:
            <select v-model="newCharger.status" required>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="out_of_service">Out of Service</option>
            </select>
          </label>
          <label>
            Power Output (kW):
            <input v-model.number="newCharger.powerOutput" required type="number" />
          </label>
          <label>
            Connector Type:
            <input v-model="newCharger.connectorType" required />
          </label>

          <button type="submit">{{ isEditing ? 'Update' : 'Submit' }}</button>
          <button type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>

    <div v-if="chargers.length === 0">No chargers found.</div>

    <div v-else>
      <p>Total Chargers: {{ chargers.length }}</p>
      <ul class="charger-list">
        <li v-for="charger in chargers" :key="charger._id" class="charger-card">
          <h3>{{ charger.name }}</h3>
          <p><strong>Coordinates:</strong> ({{ charger.latitude }}, {{ charger.longitude }})</p>
          <p><strong>Status:</strong> {{ charger.status }}</p>
          <p><strong>Power:</strong> {{ charger.powerOutput }} kW</p>
          <p><strong>Connector:</strong> {{ charger.connectorType }}</p>
          <div class="button-group">
            <button @click="handleDelete(charger._id)">Delete</button>
            <button @click="openModal(charger)">Edit</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import "@/assets/styles/ChargerList.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import createApi from '@/api/axios';

export default {
  data() {
    return {
      chargers: [],
      showModal: false,
      isEditing: false,
      newCharger: {
        name: '',
        latitude: '',
        longitude: '',
        status: 'available',
        powerOutput: '',
        connectorType: ''
      },
      filters: {
        status: '',
        powerOutput: '',
        connectorType: ''
      }
    };
  },
  mounted() {
    const { status, powerOutput, connectorType } = this.$route.query;
    this.filters = {
      status: status || '',
      powerOutput: powerOutput || '',
      connectorType: connectorType || '',
    };
    this.fetchFilteredChargers();


  },
  methods: {
    getEmptyCharger() {
      return {
        name: '',
        latitude: '',
        longitude: '',
        status: 'available',
        powerOutput: '',
        connectorType: ''
      };
    },
    async geocodeCity() {
      if (!this.citySearch) return;

      try {
        const query = encodeURIComponent(this.citySearch);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${query}&format=json&limit=1`);
        const data = await res.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          this.newCharger.latitude = parseFloat(lat);
          this.newCharger.longitude = parseFloat(lon);

          // Update map marker
          if (this.locationMarker && this.locationMap) {
            const latLng = [parseFloat(lat), parseFloat(lon)];
            this.locationMarker.setLatLng(latLng);
            this.locationMap.setView(latLng, 12);
          }
        } else {
          alert('City not found. Please try a different name.');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        alert('Failed to fetch location from city name.');
      }
    },
    initLocationMap(lat = 20.5937, lng = 78.9629) {
      if (this.locationMap) {
        this.locationMap.off();
        this.locationMap.remove();
        this.locationMap = null;
        this.locationMarker = null;
      }

      this.locationMap = L.map('location-map').setView([lat, lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.locationMap);

      this.locationMarker = L.marker([lat, lng], { draggable: true }).addTo(this.locationMap);

      this.locationMarker.on('dragend', () => {
        const { lat, lng } = this.locationMarker.getLatLng();
        this.newCharger.latitude = lat;
        this.newCharger.longitude = lng;
      });

      this.locationMap.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.newCharger.latitude = lat;
        this.newCharger.longitude = lng;
        this.locationMarker.setLatLng([lat, lng]);
      });
    }
    ,
    openModal(charger = null) {
      this.showModal = true;

      if (charger) {
        this.newCharger = { ...charger };
        this.isEditing = true;
        this.citySearch = '';  // or could set to city name if you store it, else empty

      } else {
        this.newCharger = this.getEmptyCharger();
        this.isEditing = false;
        this.citySearch = '';
      }

      this.$nextTick(() => {
        this.initLocationMap(
          this.newCharger.latitude || 20.5937,
          this.newCharger.longitude || 78.9629
        );
      });
    }

    ,
    closeModal() {
  this.showModal = false;
  this.newCharger = this.getEmptyCharger();
  this.citySearch = '';
  this.isEditing = false;

  if (this.locationMap) {
    this.locationMap.off();
    this.locationMap.remove();
    this.locationMap = null;
    this.locationMarker = null;
  }
}
,
    async handleCharger() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in.');
        this.$router.push('/login');
        return;
      }
      const api = createApi(token);

      try {
        if (this.isEditing) {
          const res = await api.put(`/charging-points/${this.newCharger._id}`, this.newCharger);
          this.chargers = this.chargers.map(c =>
            c._id === this.newCharger._id ? res.data : c
          );
        } else {
          const res = await api.post('/charging-points', this.newCharger);
          this.chargers.push(res.data);
        }
        this.closeModal();
      } catch (err) {
        console.error('Error handling charger:', err);
        alert('An error occurred. Please try again.');
      }
    },
    // async fetchChargers() {
    //   const token = localStorage.getItem('token');
    //   const api = createApi(token);
    //   try {
    //     const res = await api.get('/charging-points');
    //     this.chargers = res.data;
    //   } catch (err) {
    //     console.error('Failed to fetch chargers:', err);
    //   }
    // },
    async fetchFilteredChargers() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in.');
        this.$router.push('/login');
        return;
      }
      const api = createApi(token);

      try {
        const params = {};
        if (this.filters.status) params.status = this.filters.status;
        if (this.filters.powerOutput) params.powerOutput = this.filters.powerOutput;
        if (this.filters.connectorType) params.connectorType = this.filters.connectorType;

        // Update URL with query params
        this.$router.push({ query: params });

        const res = await api.get('/charging-points/filter', { params });
        this.chargers = res.data;
      } catch (err) {
        console.error('Error fetching filtered chargers:', err);
        alert('Failed to fetch filtered chargers.');
      }
    },
    clearFilters() {
      this.filters = {
        status: '',
        powerOutput: '',
        connectorType: '',
      };
      this.$router.push({ query: {} }); // Clear URL query
      this.fetchFilteredChargers();
    }
    ,
    async handleDelete(id) {
      const token = localStorage.getItem('token');
      const api = createApi(token);
      try {
        const res = await api.delete(`/charging-points/${id}`);
        if (res.status === 200) {
          this.chargers = this.chargers.filter(c => c._id !== id);
        } else {
          alert('Delete failed.');
        }
      } catch (err) {
        console.error('Error deleting charger:', err);
      }
    }
  }
};
</script>