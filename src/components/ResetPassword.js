import React, { useState, useEffect } from 'react';
import axios from '../axios.js';  // Assuming axios instance for API requests
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get the token from the URL params
  const token = new URLSearchParams(location.search).get('token');
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  // Function to handle password reset form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setError('Password must contain at least 8 characters, including uppercase, lowercase, and a number.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await axios.post('/auth/reset-password', { token, newPassword });
      console.log(response.data)
      if (response.data.error) {
        setError(response.data.error);
        console.log("reset error",response.data.error)
        setTimeout(() => message(null), 3000); 
      } else {
        setMessage('Password reset successful. You can now log in.');
        setTimeout(() => navigate('/query-login'), 7000); // Redirect to login after 3 seconds
      }
    } catch (err) {
      setError(err.response.data.error ||'An error occurred while resetting the password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="reset-password-field">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="reset-password-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

        <button type="submit" className="reset-password-button">Reset Password</button>
        {message && <p className="reset-pass-success-message">{message}</p>}
        {error && <p className="reset-pass-error-message">{error}</p>}
      </form>
      
    </div>
  );
}
export default ResetPassword;
