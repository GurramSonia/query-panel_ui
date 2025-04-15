import React, { useState, useEffect } from 'react';
import '../../styles/GroupManagement.css';
import useUserManagementEffects from '../../hooks/useUserManagementEffects.js';

const UserManagement = () => {

  const{
    userOperations,users,selectedUser,selectedSources,selectedDatabases,selectedTables,
    selectedOperations,selectedSource,selectedDatabase,selectedTable,
    viewEmail,viewPass,viewEmailPass,viewEmailChange,viewPassChange,
    setViewEmail,setViewPass,setViewEmailChange,setViewPassChange,opRemoveError,
    userRemoveMessage,userRemoveError,opAddError,opAddMessage,opRemoveMessage,emailPassMessage,
    emailPassError,isAddOperationVisible,setIsAddOperationVisible,handleSourceClick,handleDatabaseClick,
    handleTableClick,handleRemoveOperation,handleAddOperation,handleRemoveUser,handleUserClick,
    handleUpdateEmailPass,isUpdateEmailPassVisible,setIsUpdateEmailPassVisible,newOperation,setNewOperation,
    showDropdown,setShowDropdown
  }= useUserManagementEffects();
  

  return (
    <><div className='user-management-header'>
      <h3>User Management</h3>
      </div>
      <div className="user-list">
       
          <h3 className='user-users-heading' >Users</h3>
       

{/* Display users in UserManagement */}
{users.length > 0 ? (
          <div className='users-listing'>
          <ul>
            {users.map((username, index) => (
              <li
                key={index}
                className={`group-item ${selectedUser === username ? 'active' : ''}`}
                onClick={() => handleUserClick(username)}
              >
                {username}
                <button onClick={() => handleRemoveUser(username)} className='remove-buttonn'>-</button>
              </li>
            ))}
          </ul>
          {userRemoveMessage&& <p className='success-messages'>{userRemoveMessage}</p>}
          {userRemoveError&& <p className='error-messages'>{userRemoveMessage}</p>}
          </div>
        ) : (
          <p>No users available.</p>
)}

{/* Display Sources */}
{selectedSources.length > 0 && (
          <>
            <h3 className="user-sources-heading">Sources</h3>
            <div className="user-sources">
              <ul>
                {selectedSources.map((source, index) => (
                  <li 
                    key={index} 
                    className={`source-item ${selectedSource === source ? 'active' : ''}`}
                    onClick={() => handleSourceClick(source)}
                  >
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          </>
)}

{/* Display Databases */}
{selectedDatabases.length > 0 && (
          <>
            <h3 className="user-databases-heading">Databases</h3>
            <div className="user-databases">
              <ul>
                {selectedDatabases.map((database, index) => (
                  <li 
                    key={index} 
                    className={`database-item ${selectedDatabase === database ? 'active' : ''}`}
                    onClick={() => handleDatabaseClick(database)}
                  >
                    {database}
                  </li>
                ))}
              </ul>
            </div>
          </>
)}

{/* Display Tables */}
{selectedTables.length > 0 && (
          <>
            <h3 className="user-tables-heading">Tables</h3>
            <div className="user-tables">
              <ul>
                {selectedTables.map((table, index) => (
                  <li 
                    key={index} 
                    className={`table-item ${selectedTable === table ? 'active' : ''}`}
                    onClick={() => handleTableClick(table)}
                  >
                    {table}
                  </li>
                ))}
              </ul>
            </div>
            </>
)}

{/* Dispaly email and password */}
{viewEmailPass===true &&(
            <>
             <h3 className='user-tables-heading'>EmailPass</h3>
          <div className="user-viewemailpass">
          <div className="user-view-permissions">
       
        <p className='email-p'>ViewEmail: {viewEmail ? '✅ ' : '❌ '}</p>
        <p className='pass-p'>ViewPass: {viewPass ? '✅' : '❌'}</p>
      </div>
      <div className='update-email-pass'>
          <button onClick={() => setIsUpdateEmailPassVisible(!isUpdateEmailPassVisible)} className="add-user-button">
                {isUpdateEmailPassVisible ? 'Cancel' : 'Update'}
              </button>
              {isUpdateEmailPassVisible && (
      <div className="view-permissions-form">
        <label>
          <input
            type="checkbox"
            checked={viewEmailChange}
            onChange={() => setViewEmailChange(!viewEmailChange)}
          />
      ViewEmail
        </label>

        <label>
          <input
            type="checkbox"
            checked={viewPassChange}
            onChange={() => setViewPassChange(!viewPassChange)}
          />
          ViewPass
        </label>
        <button className="emil-pass-save-button" onClick={handleUpdateEmailPass}>
     Save 
   </button>
      </div>
       )}
      </div>
     
     {emailPassMessage&& <p>{emailPassMessage}</p>}
     {emailPassError&& <p>{emailPassError}</p>}
      </div>
      </>
)}
      

{/* Display Allowed Operations */}
{selectedOperations.length>0&&
<div className='operation-div' >
<div className="dropdown-container-operation">
<h3 className='user-operation-heading'>Operations</h3>
    
    {selectedOperations.length >5 &&
        <button 
          className="dropdown-button-operation" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
        {showDropdown ? "Close operations ▲":"Show operations ▼"}
        </button>
}
{selectedOperations.length <=5&&
 <ul className="list-menu-operation">
{selectedOperations.map((operation, index) => (
                <li key={index} className="dropdown-item-operation">
                  {operation}
                  <button
                    className="remove-button-operation"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dropdown from closing
                      handleRemoveOperation(operation);
                    }}
                  >
                    🗑
                  </button>
                </li>
                 
              ))}
          </ul>
    }

        {showDropdown && (
          <ul className="dropdown-menu-operation">
            {selectedOperations.length === 0 ? (
              <li className="dropdown-item-operation">No operations</li>
            ) : (
              selectedOperations.map((operation, index) => (
                <li key={index} className="dropdown-item-operation">
                  {operation}
                  <button
                    className="remove-button-operation"
                    onClick={(e) => {
                      handleRemoveOperation(operation);
                      setShowDropdown(false)
                    }}
                  >
                    🗑
                  </button>
                </li>
              ))
            )}
          </ul>
          
        )}
     
    </div>
   {!showDropdown&& <><button onClick={() => setIsAddOperationVisible(!isAddOperationVisible)}
        className="add-user-operation-button"> {isAddOperationVisible ? 'Cancel' : 'Add-Op'}
      </button>
       {isAddOperationVisible && (
        <div className="add-operation">
          <input
            type="text"
            value={newOperation}
            onChange={(e) => setNewOperation(e.target.value)}
            placeholder="Enter operation (e.g., SELECT, INSERT)"
          />
          <button onClick={handleAddOperation}>Add Operation</button>
        </div>
      )}
      </>}
      <div className='operation-mesaages'>
      {opAddError && <p className='error-messages'>{opAddError}</p>}
          {opAddMessage && <p className='success-messages'>{opAddMessage}</p>}
          {opRemoveError && <p className='operation-remove-error'>{opRemoveError}</p>}
          {opRemoveMessage && <p className='operation-remove-message'>{opRemoveMessage}</p>}
        
          </div>

</div>
}



</div>
</>
);
};

export default UserManagement;
