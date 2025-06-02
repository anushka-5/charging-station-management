Charging Stations Frontend Template
Overview
This Vue.js frontend template provides an interface for managing charging stations, allowing users to:

Login to their accounts

View, filter, and manage charging stations

Add, edit, or delete chargers

View charging stations on a map

Project Structure
frontend-template/
├── public/
│   ├── index.html
├── src/
│   ├── api/
│   ├── assets/
│   │   ├── styles/
│   ├── components/
│   ├── router/
│   ├── store/
│   ├── views/
│   │   ├── ChargerList.vue
│   │   ├── LoginForm.vue
│   │   ├── MapView.vue
│   │   ├── Register_Form.vue
│   ├── App.vue
│   ├── main.js
├── .gitignore
├── babel.config.js
Installation
Clone the Repository
sh
git clone <repository-url>
cd frontend-template
Install Dependencies
sh
npm install
Run the Project
sh
npm run serve
Features & Functionality
Login Page (LoginForm.vue)
User authentication with backend API

Saves session tokens in localStorage

Redirects to charger listing after login

Charger Listing Page (ChargerList.vue)
Displays all onboarded chargers

Filters chargers by status, power output, and connector type

Allows users to add, edit, and delete chargers

Map View (MapView.vue)
Displays charger locations using Leaflet

Uses custom icons for markers

Clicking a marker shows charger details

Styling (ChargerList.css)
Responsive design for charger listing

Hover effects for buttons

Proper button alignment

Clean UI spacing

API Configuration (api/axios.js)
Handles API requests securely using Axios:

js
import axios from "axios";
export default function createApi(token) {
  return axios.create({
    baseURL: "https://your-backend-url.com",
    headers: { Authorization: `Bearer ${token}` }
  });
}
Future Enhancements
Add pagination for charger list

Improve map functionality (cluster markers)

Implement dark mode for UI

Enhance user authentication with role-based access
