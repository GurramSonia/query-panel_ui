import React, { useState, useEffect } from 'react';
import axios from '../axios.js';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Login.css';


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
      const response = await axios.post('auth/query-login', { username, password }, { withCredentials: true });
     
      console.log("response is ",response)
      if (response.data.error) {
        setError(response.data.error);
        console.log("this is the error response",response.data.error);
      }
      if (response.data) {
        const { message, user_id, role } = response.data;
        localStorage.setItem('userId', user_id);
        localStorage.setItem('userrole', role);
        console.log(response.data.user_role)
        localStorage.setItem('username',username)
        localStorage.setItem('userInitial', username.charAt(0).toUpperCase());
        console.log("response data",response.data.error); 
        navigate(`/queryPanel?message=${encodeURIComponent(message)}`)
      }
    }
      catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          // Set the error message from the backend response
          setError(err.response.data.error);
        } else {
          // Default error message for unexpected issues
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
              <button type="submit" className="login-button">Login</button>
           </form>
              {error && <p className="error">{error}</p>}
              <div className="forgot-password-link">
                <a href="#" onClick={() => setShowModal(true)}>Forgot Password?</a>
              </div>

          </div>
     
     {showModal && (
        <div className="forgot-pass-modal">
            <div className="forgot-pass-modal-content">
              <button className="close-modal-button" onClick={handleCloseModal}>X</button>
              <h3>Forgot Password</h3>
              <form onSubmit={handleForgotPasswordSubmit} className="forgot-password-form">
                  <div className="forgot-password-field">
                    <label>Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="login-button">send mail</button>
                  
                  </div>
              </form>
                {resetError&&<p className='forgot-error'>{resetError}</p>}
                      {resetMessage&&<p className='forgot-message'>{resetMessage}</p>}
            </div>
        </div>
     )}
    </div>
  );
}

export default Login;
