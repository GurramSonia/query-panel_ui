import React, { act } from 'react';
import { NavLink, Route, Routes, useLocation,useParams } from 'react-router-dom';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import PrivateRoute from './components/PrivateRoute'; 
import ResetPassword from './components/ResetPassword.js';

import './styles/App.css';


const App = () => {
  const location = useLocation(); // Get the current location
  const user_role=localStorage.getItem('userrole')
  console.log("my app.js userrole is",user_role) 
  console.log("my backend_url from eks",process.env.REACT_APP_BACKEND_URL)
  const heading = (location.pathname === "/" || location.pathname === "/query-login") ? 'Welcome To QueryPanel App' : '';
  console.log("path",location.pathname)

  return (
    <div className="App">
       <h1 className="heading1">{heading}</h1> 
    <Routes>
        {/* Login Route */}
        <Route path="/query-login" element={<Login />} />
        <Route path="/query-signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Login />} /> 

        {/*dashboard route*/}
       { <Route
          path="/:section?/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        /> } 
       
      </Routes>
    </div>
)
}

export default App;
