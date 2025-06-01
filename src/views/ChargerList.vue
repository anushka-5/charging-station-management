<template>
  <div class="charger-list-container">
    <h2>All Charging Stations</h2>
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
            Location:
            <input v-model="newCharger.location" required />
          </label>
          <label>
            Status:
            <select v-model="newCharger.status" required>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="out_of_service">Out of service</option>
            </select>
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
          <p><strong>Location:</strong> {{ charger.location }}</p>
          <p><strong>Status:</strong> {{ charger.status }}</p>
          <button @click="handleDelete(charger._id)">Delete</button>
          <button @click="openModal(charger)">Edit</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import createApi from '@/api/axios';

export default {
  data() {
    return {
      chargers: [],
      showModal: false,
      isEditing: false,
      newCharger: {
        name: '',
        location: '',
        status: 'available'
      }
    };
  },
  mounted() {
    this.fetchChargers(); // ✅ ensure this is here
  },
  methods: {
    openModal(charger = null) {
      if (charger) {
        this.newCharger = { ...charger }; // Pre-fill with existing charger data\
        this.isEditing = true; // Set editing mode
      } else {
        this.isEditing = false; // Reset to add mode
        this.newCharger = { name: '', location: '', status: 'Available' }; // Reset for new charger
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false; // Reset editing state
      this.newCharger = { name: '', location: '', status: 'Available' };
    },
    async handleCharger() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to perform this action.');
        this.$router.push('/login');
        return;
      }
      const api = createApi(token);

      try {
        // console.log({...this.newCharger}); // Debugging line

        if (this.isEditing) {
          const res = await api.put(`/charging-points/${this.newCharger._id}`, this.newCharger);

          if(res.status == 200) {
            // Replace the old charger in the list
            this.chargers = this.chargers.map(currentCharger =>
            currentCharger._id === this.newCharger._id ? res.data : currentCharger
            );
          }
        } else {
          const res = await api.post('/charging-points', this.newCharger);

          this.chargers.push(res.data); // Add new charger
        }
        this.closeModal();
      } catch (err) {
        console.error('Error adding charger', err);
        alert('Failed to add charger');
      }
    },
    async fetchChargers() {
      const token = localStorage.getItem('token');
      const api = createApi(token);

      try {
        const res = await api.get('/charging-points');
        this.chargers = res.data;
      } catch (err) {
        console.error('Network error', err);
      }
    },
    async handleDelete(chargerId) {
      const token = localStorage.getItem('token');
      const api = createApi(token);

      try {
        const response = await api.delete(`/charging-points/${chargerId}`);
        if (response.status === 200) {
          this.chargers = this.chargers.filter(charger => charger._id !== chargerId);
        } else {
          alert('Failed to delete charger');
        }
      } catch (err) {
        console.error('Error deleting charger', err);
      }
    }
  }

};
</script>

<style scoped>
.charger-list-container {
  padding: 20px;
  background-color: #c4fcef;
  min-height: 100vh;
}

h2 {
  color: #005245;
  text-align: center;
  margin-bottom: 20px;
}

.charger-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.charger-card {
  background-color: #ffffff;
  border: 2px solid #4d8076;
  border-radius: 10px;
  padding: 20px;
  color: #005245;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}

.modal-content h3 {
  margin-top: 0;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-content input,
.modal-content select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>