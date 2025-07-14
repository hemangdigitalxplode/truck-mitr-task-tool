// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://truckmitr.com/task/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject token from localStorage (even if it's not part of employee object)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 👈 read directly
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Token attached:', token);
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
