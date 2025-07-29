import React, { useState } from 'react';
import axios from '../axios.js';
import { useNavigate } from 'react-router-dom';
import '../styles/AddUser.css';
import CryptoJS from "crypto-js";
const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
  const key = CryptoJS.enc.Utf8.parse(token); // Token as key (must be 16/24/32 bytes)
  const iv = "1234567812345678";
  const encrypted = CryptoJS.AES.encrypt(password, key, {
  iv: CryptoJS.enc.Utf8.parse(iv),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});
const encryptedPassword = encrypted.toString();

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const response = await axios.post('auth/query-signup', { username, email, password, role });
      const response = await axios.post('auth/query-signup', { username, email, password: encryptedPassword, iv, token, role });

      const message = response.data[0]?.message;
      if (response.data[0]?.message) {
        navigate(`/query-login?message=${encodeURIComponent(message)}`);
      }

      if (response.data.flash_messages && response.data.flash_messages.length > 0) {
        setFlashMessages(response.data.flash_messages);
      }
      if (response.data[0]?.error) {
        setError(response.data[0]?.error || 'Signup failed! Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed! Please try again.');
    }


  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-field">
          <label>Username</label>
          <input
            type="text"
            placeholder="your_name(atleast 5 characters)" 
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>

        <div className="signup-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="example@altimetrik.com" 
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        <div className="signup-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="atleast 6 chars with upper, lower case letter and a digit"  
          
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div className="signup-field">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
<button type="submit" className="signup-button" >Signup</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Signup;
