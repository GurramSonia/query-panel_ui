import React, { useState } from 'react';
import '../../styles/GroupForm.css';

const CreateGroupForm = ({ users, handleCreateGroup, error, successMessage }) => 
{
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleUserCheckboxChange = (username) => {
    if (selectedUsers.includes(username)) {
      setSelectedUsers(selectedUsers.filter((user) => user !== username));
    } else {
      setSelectedUsers([...selectedUsers, username]);
    }
  };

  return (
    <div className="add-container">
      <form onSubmit={(e) => handleCreateGroup(e, groupName, selectedUsers)}>
        
          <label className="label-group">Create a New Group</label>
          <input
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="group-input"
          />

          <label className="label-group">Select Users</label>
              <div className="group-dropdown">
                  <div className="group-dropdown-header" onClick={toggleDropdown}>
                    {selectedUsers.length > 0
                      ? `${selectedUsers.length} user(s) selected`
                      : 'Select Users'}
                    <span className="group-dropdown-arrow">{isDropdownOpen ? '▼':'▲'  }</span>
                  </div>
                  {isDropdownOpen && (
                    <div className="group-dropdown-options">
                      {users.map((user) => (
                        <label key={user.id} className="group-dropdown-option">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.username)}
                            onChange={() => handleUserCheckboxChange(user.username)}
                          />
                          {user.username}
                        </label>
                      ))}
                    </div>
                  )}
              </div>

          <button type="submit" className="create-button"> Create Group </button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
      { error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateGroupForm;
