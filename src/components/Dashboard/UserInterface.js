// components/UserInterface.js
import React from 'react';
import '../../styles/UserInterface.css';
const UserInterface = ({ username, userInitial, handleLogout, showInterface, toggleInterface }) => (
  <div className="navs">
    {showInterface && (
      <div className="dashboard-interface">
        <div className="interface-avatar">{username}</div>
        <button className="interface-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )}
    <div className="logo-container" onClick={toggleInterface}>
      <div className="user-avatar">{userInitial}</div>
    </div>
  </div>
);

export default UserInterface;
