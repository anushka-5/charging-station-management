<template>
  <div class="charger-list-container">
    <h2>All Charging Stations</h2>
     <div class="button-container">
      <button class="map-button" @click="$router.push('/map')">Map</button>

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
            Latitude:
            <input v-model.number="newCharger.latitude" required type="number" step="any" />
          </label>
          <label>
            Longitude:
            <input v-model.number="newCharger.longitude" required type="number" step="any" />
          </label>
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
      }
    };
  },
  mounted() {
    this.fetchChargers();
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
    openModal(charger = null) {
      this.showModal = true;
      if (charger) {
        this.newCharger = { ...charger };
        this.isEditing = true;
      } else {
        this.newCharger = this.getEmptyCharger();
        this.isEditing = false;
      }
    },
    closeModal() {
      this.showModal = false;
      this.newCharger = this.getEmptyCharger();
      this.isEditing = false;
    },
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
    async fetchChargers() {
      const token = localStorage.getItem('token');
      const api = createApi(token);
      try {
        const res = await api.get('/charging-points');
        this.chargers = res.data;
      } catch (err) {
        console.error('Failed to fetch chargers:', err);
      }
    },
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

