import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL|| 'http://localhost:5000/queryapi/'

const axiosInstance = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
