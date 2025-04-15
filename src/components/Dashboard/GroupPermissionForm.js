import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import '../../styles/GroupPermissions.css';

const PermissionsForm = ({ groups }) => {
  const [availableOperations, setAvailableOperations] = useState([]);
  const [permissionsForm, setPermissionsForm] = useState({
    group: '',
    tableName: '',
    source: '',
    operations: [],
    view_email: false, // Add view_email to the state
    view_pass: false,
  });
  const [permissionsMessage, setPermissionsMessage] = useState('');
  const [permissionsError, setPermissionsError] = useState('');

  // Update available operations based on selected source
  useEffect(() => {
    if (permissionsForm.source === 'mysql') {
      setAvailableOperations(['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP']);
    } else if (permissionsForm.source === 'mongodb') {
      setAvailableOperations([
        'find', 'insert', 'update', 'delete', 
        'insert_one', 'insert_many', 'update_one', 
        'update_many', 'delete_one', 'delete_many', 'drop'
      ]);
    } else {
      setAvailableOperations([]);
    }
  }, [permissionsForm.source]);

  // Handle input changes for form fields
  const handlePermissionsChange = (event) => {
    const { name, value } = event.target;
    setPermissionsForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPermissionsForm((prevForm) => ({
      ...prevForm,
      [name]: checked,
    }));
  };

  // Handle checkbox changes for operations
  const handleOperationChange = (event) => {
    const { value, checked } = event.target;
    setPermissionsForm((prevForm) => ({
      ...prevForm,
      operations: checked
        ? [...prevForm.operations, value]
        : prevForm.operations.filter((op) => op !== value),
    }));
  };

  // Handle form submission
  const handlePermissionsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        'admin/group-permissions', 
        permissionsForm, // Corrected from PermissionsForm to permissionsForm
        { withCredentials: true }
      );
      setPermissionsMessage(response.data.message || 'Permission assigned successfully.');
      setPermissionsError('');
      setPermissionsForm({ group: '', tableName: '', source: '', operations: [] });// Reset form
      setTimeout(() => setPermissionsMessage(null), 3000);
    } 
    catch (err) {
      setPermissionsError(err.response?.data?.error || 'An error occurred while assigning permissions.');
      setTimeout(() => setPermissionsError(null), 3000);
    }
  };

  return (
    <div className="group-permissions-form">
      <h3>Assign Group Permissions</h3>
      <form onSubmit={handlePermissionsSubmit}>
            <div>
              <label>Select Group</label>
              <select
                name="group"
                value={permissionsForm.group}
                onChange={handlePermissionsChange}
                required
              >
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.group_name}>
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Source (Database)</label>
              <select
                name="source"
                value={permissionsForm.source}
                onChange={handlePermissionsChange}
                required
              >
                <option value="">Select Source</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>

            <div>
              <label>Database name</label>
              <input
                type="text"
                name="db_name"
                value={permissionsForm.db_name}
                onChange={handlePermissionsChange}
                required
              />
            </div>

            <div>
              <label>Table Name</label>
              <input
                type="text"
                name="tableName"
                value={permissionsForm.tableName}
                onChange={handlePermissionsChange}
                required
              />
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
                      checked={permissionsForm.operations.includes(operation)}
                      onChange={handleOperationChange}
                    />
                    <label>{operation}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="permission-checkbox-container">
              <label  className="permission-checkbox"> 
                <input
                  type="checkbox"
                  name="view_email"
                  checked={permissionsForm.view_email}
                  onChange={handleCheckboxChange}
                />{' '}
                View Email
              </label>
              <label  className="permission-checkbox">
                <input
                  type="checkbox"
                  name="view_pass"
                  checked={permissionsForm.view_pass}
                  onChange={handleCheckboxChange}
                />{' '}
                View Password
              </label>
            </div>
      

            <button type="submit" className="group-permission-submit-button">
          Assign Permission
        </button>
      </form>
        {permissionsMessage && <p className="group-permissions-message">{permissionsMessage}</p>}
        {permissionsError && <p className="group-permissions-error">{permissionsError}</p>}
    </div>
  );
};

export default PermissionsForm;
