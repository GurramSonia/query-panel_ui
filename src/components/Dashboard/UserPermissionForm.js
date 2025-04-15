import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios'; 
import '../../styles/UserPermissions.css';
const UserpermissionsForm = ({ admins,nonAdmins }) => {
  const [availableOperations, setAvailableOperations] = useState([]);
  const [users, setUsers] = useState([]);
  const [userpermissionsForm, setUserPermissionsForm] = useState({
      username: '',
      tableName: '',
      source: '',
      operations: [],
      view_email: false, // Add view_email to the state
      view_pass: false,
    });
  const [userpermissionsMessage, setuserPermissionsMessage] = useState('');
  const [userpermissionsError, setuserPermissionsError] = useState(''); 

    
    
  // Handle the operations based on the selected source
  useEffect(() => {
      if (admins && nonAdmins) {
        setUsers([...admins, ...nonAdmins]);
      }
      console.log(users)
    }, [admins, nonAdmins]);
    
  useEffect(() => {
      if (userpermissionsForm.source === 'mysql') {
        setAvailableOperations(['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP']);
      } 
      else if (userpermissionsForm.source === 'mongodb') {
        setAvailableOperations([
          'find', 'insert', 'update', 'delete', 
          'insert_one', 'insert_many', 'update_one', 
          'update_many', 'delete_one', 'delete_many', 'drop'
        ]);
      } 
      else {
        setAvailableOperations([]);
      }
    }, [userpermissionsForm.source]);
  
    // Handle input changes for form fields
  const handleuserPermissionsChange = (event) => {
      const { name, value } = event.target;
      setUserPermissionsForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    };
  
    // Handle checkbox changes for operations
  const handleOperationChange = (event) => {
      const { value, checked } = event.target;
      setUserPermissionsForm((prevForm) => ({
        ...prevForm,
        operations: checked
          ? [...prevForm.operations, value]
          : prevForm.operations.filter((op) => op !== value),
      }));
    };

  const handleCheckboxChange = (event) => {
      const { name, checked } = event.target;
      setUserPermissionsForm((prevForm) => ({
        ...prevForm,
        [name]: checked,
      }));
    };
  
    // Handle form submission
  const handleuserPermissionsSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axiosInstance.post(
          'admin/user-permissions', 
          userpermissionsForm, // Corrected from PermissionsForm to permissionsForm
          { withCredentials: true }
        );
        console.log(response.data.message )
        setuserPermissionsMessage(response.data.message || 'Permission assigned successfully.');
        console.log("user",userpermissionsMessage)
        setuserPermissionsError('');
        // Reset form
        setUserPermissionsForm({ username: '', tableName: '', source: '',db_name:'', operations: [] });
        setTimeout(() => setuserPermissionsMessage(null), 3000);
      } catch (err) {
        setuserPermissionsError(err.response?.data?.error || 'An error occurred while assigning permissions.');
        setTimeout(() => setuserPermissionsError(null), 3000);
      }
  };
  

  return (
      <div className="permissions-form">
            <h3>Assign user Permissions</h3>
          <form onSubmit={handleuserPermissionsSubmit}>
            <div>
                <label>Select user</label>
                <select id="userDropdown" name='username' value={userpermissionsForm.username || ""}
                    onChange={handleuserPermissionsChange}>
                    <option value=""> Select User </option>
                    {users.map((user, index) => (
                        <option key={index} value={user.username}>
                          {user.username}
                        </option>
                    ))}
                </select>
            </div>
    
            <div>
                <label>Source (Database)</label>
                <select name="source" value={userpermissionsForm.source}
                  onChange={handleuserPermissionsChange} required >
                  <option value="">Select Source</option>
                  <option value="mysql">MySQL</option>
                  <option value="mongodb">MongoDB</option>
                </select>
            </div>

            <div>
                <label>Database name</label>
                <input type="text" name="db_name" value={userpermissionsForm.db_name}
                  onChange={handleuserPermissionsChange} required />
            </div>

            <div>
                <label>Table Name</label>
                <input type="text" name="tableName" value={userpermissionsForm.tableName} 
                onChange={handleuserPermissionsChange} required />
            </div>

            <div>
                <label>Operations</label>
                <div className="operations-checkboxes">
                  {availableOperations.map((operation) => (
                    <div key={operation}>
                      <input
                        type="checkbox"
                        name="operations"
                        value={operation}
                        checked={userpermissionsForm.operations?.includes(operation) || false} // Safe access with optional chaining
                        onChange={handleOperationChange}
                      />
                      <label>{operation}</label>
                    </div>
                  ))}
                 </div>
            </div>
         
            <div className="permission-checkbox-container">
                <label className="permission-checkbox">
                  <input
                    type="checkbox"
                    name="view_email"
                    checked={userpermissionsForm.view_email}
                    onChange={handleCheckboxChange}
                  />{' '}
                  View Email
                </label>

                <label className="permission-checkbox">
                  <input
                    type="checkbox"
                    name="view_pass"
                    checked={userpermissionsForm.view_pass}
                    onChange={handleCheckboxChange}
                  />{' '}
                  View Password
                </label>
            </div>

            <button type="submit" className="dashboard-permission-submit-button">
            Assign Permission
            </button>
          </form>
        {userpermissionsMessage && <p className="permissions-message">{userpermissionsMessage}</p>}
        {userpermissionsError && <p className="permissions-error">{userpermissionsError}</p>}
        
      </div>
  );
};

export default UserpermissionsForm;
