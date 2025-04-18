
import React, { useState } from 'react';
import axiosInstance from '../../axios'; 
import '../../styles/AddUser.css'

const AddUser = () => { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const[message,setMessage]=useState('')

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
      const response = await axiosInstance.post('auth/query-signup', { username, email, password, role });

      const message = response.data[0]?.message;
      if (response.data[0]?.message) {
       setMessage(message)
       setTimeout(() => setMessage(null), 3000);
       setUsername('')
       setEmail('')
       setRole('')
       setPassword('')

      }

      if (response.data.flash_messages && response.data.flash_messages.length > 0) {
        setFlashMessages(response.data.flash_messages);
        setTimeout(() => setFlashMessages(null), 3000);
      }
      if (response.data[0]?.error) {
        setError(response.data[0]?.error || 'Signup failed! Please try again.');
        setTimeout(() => setError(null), 7000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed! Please try again.');
      setTimeout(() => setError(null), 7000);
    }
  };
 
  return (
   <div className="add-user-form">
      <div className="signup-container">
          <h2>Add user</h2>
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
            <button type="submit" className="signup-button" >Add User</button>
          </form>
          {error && <p className="error">{error}</p>}
          {message&& <p className='message'>{message}</p>}
      </div>
    </div>
  );
};

export default AddUser;
