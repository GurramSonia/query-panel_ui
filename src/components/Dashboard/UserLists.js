import React, { useState } from 'react';
import '../../styles/UserList.css';
import AddUser from './AddUser.js';

const UserLists = ({ admins, nonAdmins, error,activeSection,setActiveSection }) => {
  const [activeUserSection, setActiveUserSection] = useState("admins"); 
  const [showAddUserForm, setShowAddUserForm] = useState("admins"); // Default to "admins"

  return (
    <div className="user-section">
      {error && <p className="error-message">{error}</p>}

{/* Buttons to switch between sections */}
      <div className="tabs">
        <button className={activeSection === "admins" ? "active" : ""}
          onClick={() => setActiveSection("admins")}> Admins </button>
        <button className={activeSection === "nonAdmins" ? "active" : ""}
          onClick={() => setActiveSection("nonAdmins")}>
          Non-Admins
        </button>
        
      </div>
      <div className='invite-users'>
      <button className={activeSection === "addUser" ? "active" : ""} onClick={()=>{setActiveSection("addUser")} }>Invite Users</button>
      </div>
      {activeSection==='addUser'&& <AddUser />}


{/* Admins List */}
      {activeSection === "admins" && (
        <div className="admin">
          <h2>Admins</h2>
          {admins && admins.length > 0 ? (
            <ul>
              {admins.map((admin, index) => (
                <li key={index}>{admin.username}</li>
              ))}
            </ul>
          ) : (
            <p>No admins found.</p>
          )}
        </div>
      )}

{/* Non Admins List */}
      {activeSection === "nonAdmins" && (
        <div className="non-admin">
          <h2>Non-Admins</h2>
          {nonAdmins && nonAdmins.length > 0 ? (
            <ul>
              {nonAdmins.map((user, index) => (
                <li key={index}>
                  {user.username} ({user.role})
                </li>
              ))}
            </ul>
          ) : (
            <p>No non-admin users found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserLists;
