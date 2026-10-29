import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Replace with your API base URL
})

export default api;