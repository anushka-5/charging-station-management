Charging Stations Frontend Template

## Overview

This Vue.js frontend template provides an interface for managing charging stations, allowing users to:

* Login to their accounts
* View, filter, and manage charging stations
* Add, edit, or delete chargers
* View charging stations on a map

## Project Structure

```
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
```

## Installation

### Clone the Repository

```sh
git clone <repository-url>
cd frontend-template
```

### Install Dependencies

```sh
npm install
```

### Run the Project

```sh
npm run serve
```

## Features & Functionality

### Login Page (LoginForm.vue)

* User authentication with backend API
* Saves session tokens in localStorage
* Redirects to charger listing after login

### Charger Listing Page (ChargerList.vue)

* Displays all onboarded chargers
* Filters chargers by status, power output, and connector type
* Allows users to add, edit, and delete chargers

### Map View (MapView\.vue)

* Displays charger locations using Leaflet
* Uses custom icons for markers
* Clicking a marker shows charger details

### Styling (ChargerList.css)

* Responsive design for charger listing
* Hover effects for buttons
* Proper button alignment
* Clean UI spacing

### API Configuration (api/axios.js)

Handles API requests securely using Axios:

```js
import axios from "axios";
export default function createApi(token) {
  return axios.create({
    baseURL: "https://your-backend-url.com",
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

## 🔍 Filter Functionality (Charging Stations)

The application allows users to **filter charging stations** by:

* **Status** (e.g., `available`, `occupied`, `out_of_service`)
* **Power Output** (e.g., `22`, `44`)
* **Connector Type** (e.g., `Type 2`, `CCS`, `CHAdeMO`)

### 🔧 Backend (Express + Mongoose)

A dedicated controller method handles filtered queries based on user input:

```js
export const getFilteredChargingPoints = async (req, res) => {
    const userId = req.user._id;
    const { status, powerOutput, connectorType } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;
    if (powerOutput) filter.powerOutput = Number(powerOutput);
    if (connectorType) filter.connectorType = connectorType;

    const chargingPoints = await ChargingPoint.find(filter);
    res.status(200).json(chargingPoints);
};
```

Route:

```js
GET /api/charging-points/filter
```

### 🌐 Frontend (Vue.js + Axios)

The user applies filters through dropdowns. Selected values are passed to the backend:

```js
const api = createApi(token);
const response = await api.get("/charging-points/filter", {
  params: {
    status: selectedStatus,
    powerOutput: selectedPowerOutput,
    connectorType: selectedConnectorType
  }
});
chargers.value = response.data;
```

Filtering is **reactive**, updating results as the user changes filter options.

## Future Enhancements

* Add pagination for charger list
* Improve map functionality (cluster markers)
* Implement dark mode for UI
* Enhance user authentication with role-based access
