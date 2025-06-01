import axios from 'axios';

const createApi = (token = null) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return axios.create({
            baseURL: 'http://localhost:3000/api', // Update for production later
            headers,
        });
    } catch (error) {
        console.error('Error creating axios instance:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

export default createApi;
