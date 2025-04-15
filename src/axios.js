import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL|| 'http://localhost:5000/queryapi/'
const axiosInstance = axios.create({
    baseURL:backendUrl,
 headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
