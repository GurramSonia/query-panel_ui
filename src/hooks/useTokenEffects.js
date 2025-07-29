import { useState, useEffect } from 'react';
import axios from '../axios';
import CryptoJS from "crypto-js";
const useTokenEffects = () => {
 const [token, setToken] = useState("");
  useEffect(() => {
  const fetchToken = async () => {
    try {
      const response = await axios.get('auth/get-encryption-token');
      const token = response.data.token;
      setToken(token); // save it in state if needed
    } catch (err) {
      console.error('Failed to fetch token:', err);
    }
  };

  fetchToken();
}, []);


return{
    token,
}
}
export default useTokenEffects;