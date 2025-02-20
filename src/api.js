import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const API = axios.create({
  baseURL: API_BASE_URL, // Change this if your backend is hosted elsewhere
});

// 🔹 Attach token for protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Store JWT token in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
