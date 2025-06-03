import axios from 'axios';

const createApi = (token = null) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        let baseURL = process.env.VITE_BACKEND_API_URL + '/api'; // Use environment variable for base URL
        return axios.create({
            baseURL: "https://charging-station-backend-fdkt.onrender.com,
            headers,
        });
    } catch (error) {
        console.error('Error creating axios instance:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

export default createApi;
