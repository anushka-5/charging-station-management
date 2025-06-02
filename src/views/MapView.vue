<template>
  <div>
    <h2>Charging Stations Map</h2>
    <div id="map" style="height: 500px;"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import createApi from "@/api/axios";

export default {
  data() {
    return {
      chargers: [],
      map: null
    };
  },
  async mounted() {
    this.initMap();
    await this.fetchChargers();
  },
  methods: {
    initMap() {
      this.map = L.map("map").setView([20.5937, 78.9629], 5); // Centered on India
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
    },
    async fetchChargers() {
      const token = localStorage.getItem("token");
      const api = createApi(token);
      try {
        const res = await api.get("/charging-points");
        this.chargers = res.data;
        this.addMarkers(); // Ensure markers are added after fetching data
      } catch (err) {
        console.error("Error fetching chargers:", err);
      }
    },
    addMarkers() {
      if (!this.map || this.chargers.length === 0) return;

      this.chargers.forEach(point => {
        if (point.latitude && point.longitude) {
          const customIcon = L.divIcon({
            html: '<div class="custom-map-icon"><i class="ri-map-pin-line"></i></div>',
            className: "", // Prevent default Leaflet styling
            iconSize: [30, 30], 
            iconAnchor: [15, 30] // Adjust positioning
          });

          L.marker([point.latitude, point.longitude], { icon: customIcon })
            .addTo(this.map)
            .bindPopup(`<b>${point.name}</b><br>Status: ${point.status}`);
        }
      });
    }
  }
};
</script>

<style>
#map {
  width: 100%;
  height: 500px;
  border: 2px solid #4d8076;
  border-radius: 10px;
}

.custom-map-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.custom-map-icon i {
  font-size: 28px;
  color: #0083c6;
}
</style>
