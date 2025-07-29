import React, { useState, useEffect } from 'react';
import axios from '../axios.js';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';
import CryptoJS from "crypto-js";
import 'bootstrap/dist/css/bootstrap.min.css';
import useTokenEffects from '../hooks/useTokenEffects.js';
import usePasswordEncryptEffects from '../hooks/usePasswordEncryptEffects.js';



const Login = () =>{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [resetEmail, setResetEmail] = useState('');    // State for reset email
  const [resetMessage, setResetMessage] = useState(''); // Message after reset request
  const [resetError, setResetError] = useState('');   
  const navigate = useNavigate();
  const location = useLocation();
  const {token} = useTokenEffects();
  const{encryptPassword,iv,}=usePasswordEncryptEffects(token);
  const encryptedPassword = encryptPassword(password);
  // To dispaly the flash message
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log('params are',params)
    const message = params.get('message');
    const pathname=location.pathname;
    console.log('path is',pathname)
    if (message) {
      setFlashMessage(message);
      setTimeout(() => setFlashMessage(null), 3000);
    }
  }, [location]);
 
/*  Verifying Login details  after submitting */


const handleForgotPasswordSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('auth/forgot-password', { email: resetEmail });
    setResetMessage(response.data.message);
    setTimeout(() => setShowModal(false), 3000); 
    setTimeout(() => setResetMessage(''), 3000); // Close modal after 3 seconds
  } catch (err) {
    setResetError(err.response.data.error || 'Failed to send reset link. Please try again.');
    setTimeout(() => setResetError(''), 3000);
    setTimeout(() => setShowModal(false), 3000); 
     
  }
};
const  handleCloseModal=()=>{
  setShowModal(false)

}
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("entered into sending api request");
      // Send login request with encrypted password
      const response = await axios.post(
        'auth/query-login',
        { username, password: encryptedPassword, iv, token },
        { withCredentials: true }
      );

      console.log("response is ", response);
      if (response.data.error) {
        setError(response.data.error);
        console.log("this is the error response", response.data.error);
        return;
      }

      if (response.data) {
        const { message, user_id, role, jwtToken } = response.data;

        // Store JWT token in localStorage if present
        if (jwtToken) {
          localStorage.setItem('jwtToken', jwtToken);
        }

        localStorage.setItem('userId', user_id);
        localStorage.setItem('userrole', role);
        localStorage.setItem('username', username);
        localStorage.setItem('userInitial', username.charAt(0).toUpperCase());
        navigate(`/queryPanel?message=${encodeURIComponent(message)}`);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        console.log("error is", err);
      } else {
        setError('Login failed! Please check your credentials.');
      }
    }
  };
  

  return (
    <div>
        {flashMessage && <p className="success-message">{flashMessage}</p>}
          <div className="login-container">
            <h2>Login</h2>
    
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="login-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* <button type="submit" className="login-button">Login</button> */}
              <div className="text-center">
  <button type="submit" className="btn btn-primary px-3">Login</button>
          </div>


           </form>
              {error && <p className="error">{error}</p>}
            {/*   <div className="forgot-password-link">
                <a href="#" onClick={() => setShowModal(true)}>Forgot Password?</a>
              </div> */}
              <button type="button" class="btn btn-link text-danger" onClick={() => setShowModal(true)}>Forgot Password ?</button>

          </div>
     
     
     {showModal && (
  <div className="forgot-pass-modal">
    <div className="forgot-pass-modal-content">
      <button
        type="button"
        className="btn btn-outline-secondary close-modal-button"
        onClick={handleCloseModal}
      >
        X
      </button>
      <h3 className="mb-4 fw-bold">Forgot Password</h3>
      <form onSubmit={handleForgotPasswordSubmit} className="forgot-password-form">
        <div className="forgot-password-field mb-3 text-start">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success px-10">Send Email</button>
      </form>
      {resetError && <p className="text-danger mt-2">{resetError}</p>}
      {resetMessage && <p className="text-success mt-2">{resetMessage}</p>}
    </div>
  </div>
)}

    </div>
  );
}

export default Login;
