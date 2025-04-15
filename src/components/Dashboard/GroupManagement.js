import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios'; // Replace with your axios instance path
//import './GroupManagement.css'; // Styling file for the component
import GroupList from './GroupList.js';
import CreateGroupForm from './CreateGroupform.js';
import '../../styles/GroupManagement.css';

const GroupManagement = ({ groups,showAddContainer,toggleAddContainer,setGroups,admins,nonAdmins,activeSection,setActiveSection }) => {
  //const [showAddContainer, setShowAddContainer] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const[removeError,setRemoveError]=useState('')
  const[userRemoveMessage,setUserRemoveMessage]=useState('')
  const [newUser, setNewUser] = useState('');  // State for the new user input
  const [isAddUserVisible, setIsAddUserVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const[addError,setAddError]=useState('')
  const[userAddMessage,setUserAddMessage]=useState('')
  const [groupRemoveError, setGroupRemoveError] = useState(''); 
  const [groupRemoveMessage, setGroupRemoveMessage] = useState(''); 
  const[showDropdown,setShowDropdown]=useState([false])
   const[showUserDropdown,setShowUserDropdown]=useState([false])
  
  useEffect(() => {
    if (admins && nonAdmins) {
      setUsers([...admins, ...nonAdmins]);
    }
    console.log("showadd",showAddContainer)
  }, [admins, nonAdmins]);
  
  const handleCreateGroup = async (e, groupName, selectedUsers) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!groupName || selectedUsers.length === 0) {
        setError('Please provide a group name and select at least one user.');
        return;
    }

    try {
        const response = await axiosInstance.post(
            'admin/create-group',
            { groupName, users: selectedUsers },
            { withCredentials: true }
        );

        console.log("Response from create group:", response.data);

        if (response.data?.message) {
            console.log("Success:", response.data.message);
            setSuccessMessage('Group created successfully!');
            setError('');  // Clear any previous error
            setTimeout(() => setSuccessMessage(null), 3000);
            
            // Reset form fields
            setGroupName('');
            setSelectedUsers([]);
            setIsDropdownOpen(false);

            // Update group list
            setGroups((prevGroups) => [...prevGroups, { groupName, users: selectedUsers }]);
        } else if (response.data?.error) {
            console.log("Error:", response.data.error);
            setError(response.data.error);
            setSuccessMessage('');  // Ensure success message is cleared
        } else {
            setError('Unexpected response from server.');
        }
    } catch (err) {
        console.log("Error in request:", err.response?.data);
        setError(err.response?.data?.error); // Ensure success message is cleared
        setTimeout(() => setError(null), 3000);
    }
};

  

  // Handle selecting a group to view its users
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setShowUserDropdown(false)
    setShowDropdown(false)

  };

  const handleRemoveUser = async (username) => {
    if (!window.confirm(`Are you sure you want to remove user "${username}"? from group "${selectedGroup.group_name}"?` )) return;
    try {
      const response = await axiosInstance.post("admin/remove_user", {
        group_name: selectedGroup.group_name,
        username: username,
      });
      console.log("response is",response.data)
      if (response.data.message) {
        setSelectedGroup(prevGroup => ({
          ...prevGroup,
          users: prevGroup.users.filter(user => user !== username),
        }));
    
        setUserRemoveMessage(`${username} removed successfully`);
        setTimeout(() => setUserRemoveMessage(null), 3000);
      }
      else {
        console.log("remove error is the",response.data.error)
        setRemoveError(response.data.error);
         }
    } 
    catch (error) {
      console.error("Error removing user:", error);
      setRemoveError(` Error in removing  ${username} user `);
      setTimeout(() => setRemoveError(null), 3000);
    }
  };

  // ADD new user for group

  const handleAddNewUser = async (newUser) => {
    if (!newUser.trim()) {
      setError('Please provide a valid username.');
      return;
    }

    try {
      setIsLoading(true); // Show loading indicator
      const response = await axiosInstance.post("admin/add_user", {
        group_name: selectedGroup.group_name,
        username: newUser,
      });

      if (response.data.message) {
        // Update the group state to reflect the newly added user
        setSelectedGroup(prevGroup => ({
          ...prevGroup,
          users: [...prevGroup.users, newUser],  // Add the new user to the list of users
        }));
        setNewUser('');  // Clear the input field after adding the user
        setIsAddUserVisible(false);  // Hide the add user form
        setUserAddMessage(`${newUser} added successfully`);  // Show success message
        setTimeout(() => setUserAddMessage(''), 3000);  // Hide success message after a timeout
      } 
      else {
        setRemoveError(response.data.error);  // Set error message
        setTimeout(() => setRemoveError(''), 3000);  // Clear error message after a timeout
      }
    } 
    catch (error) {
      setAddError(`Error adding user ${newUser}`);  // Set error message
      setTimeout(() => setAddError(''), 3000);  // Clear error message after a timeout
    } 
    finally {
      setIsLoading(false); // Hide loading indicator
    }
  };


  const handleRemoveGroup = async (groupName) => {
    if (!window.confirm(`Are you sure you want to remove groupName "${groupName}"?`)) return;
    try {
      const response = await axiosInstance.post("admin/remove_group", { group_name: groupName });
      if (response.data.message) {
        console.log(`Group '${groupName}' removed successfully`);
        // Filter out the removed group from the UI
        setGroups((prevGroups) => prevGroups.filter((group) => group.group_name !== groupName));
        handleGroupClick(null); // Deselect group if it's removed
        setGroupRemoveMessage(`Group '${groupName}' removed successfully`);
        setTimeout(() => setGroupRemoveMessage(''), 3000);
      } 
      else {
        setGroupRemoveError(response.data.error);
        setTimeout(() => setGroupRemoveError(''), 3000);
      }
    } 
    catch (error) {
      console.error(`Error removing group '${groupName}':`, error);
      setGroupRemoveError(`Error removing group '${groupName}'`);
      setTimeout(() => setGroupRemoveError(''), 3000);
    }
 

  };
  const  handleAddGroup  = () => {
    toggleAddContainer()
    console.log(showAddContainer)
    if (!showAddContainer) {
      setActiveSection('add-group'); // If closed, switch to 'add-group'
  } else {
      setActiveSection('group-management'); // Otherwise, keep 'group-management'
  }
}
  return (
    <div className="group-management">
      <div className="group-management-header">
       <h3>Group Management</h3> 
      </div>
      <button onClick={handleAddGroup} className="toggle-button"> {showAddContainer ? 'Close' : 'Add Group'}</button>

        {(showAddContainer && activeSection==='add-group')&& (
            <CreateGroupForm
              users={users}
              handleCreateGroup={handleCreateGroup}
              error={error}
              successMessage={successMessage}
            />
          )}
  
        {(!showAddContainer) &&
          <div className="group-management">
            <GroupList
              groups={groups}
              selectedGroup={selectedGroup}
              handleGroupClick={handleGroupClick}
              handleRemoveUser={handleRemoveUser}
              removeError={removeError}
              userRemoveMessage={userRemoveMessage}
              handleAddNewUser={handleAddNewUser}
              addError={addError}
              userAddMessage={userAddMessage}
              isAddUserVisible={isAddUserVisible}
              setIsAddUserVisible={setIsAddUserVisible}
              handleRemoveGroup={handleRemoveGroup}
              groupRemoveError={groupRemoveError}
              groupRemoveMessage={groupRemoveMessage}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              showUserDropdown={showUserDropdown}
              setShowUserDropdown={setShowUserDropdown}
              newUser={newUser}
              setNewUser={setNewUser}
            />
          </div>
        }
    </div>
  );
};

export default GroupManagement;
