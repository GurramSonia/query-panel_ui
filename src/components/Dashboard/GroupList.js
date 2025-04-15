import React, { useState, useEffect, Children } from 'react'; 
import '../../styles/GroupManagement.css';
import useGrouplistEffects from '../../hooks/useGrouplistEffects.js';

const GroupList = ({ groups, selectedGroup, handleGroupClick, handleRemoveUser, removeError, userRemoveMessage,handleAddNewUser,addError,userAddMessage,isAddUserVisible,setIsAddUserVisible,handleRemoveGroup,groupRemoveError,groupRemoveMessage,showDropdown,setShowDropdown,showUserDropdown,setShowUserDropdown,newUser,setNewUser }) => {
  const{
    groupOperations,selectedSources,selectedDatabases,selectedTables,selectedOperations,
    selectedSource,selectedDatabase,selectedTable,
    viewEmail,viewPass,viewEmailPass,viewEmailChange,viewPassChange,
    setViewEmail,setViewPass,setViewEmailChange,setViewPassChange,setViewEmailPass,
    opRemoveError,opAddError,opAddMessage,opRemoveMessage,emailPassMessage,emailPassError,
    isAddOperationVisible,setIsAddOperationVisible,handleSourceClick,handleDatabaseClick,
    handleTableClick,handleDeleteOperation,handleAddOperation,handleUpdateEmailPass,
    isUpdateEmailPassVisible,setIsUpdateEmailPassVisible,newOperation,setNewOperation,
  }= useGrouplistEffects(selectedGroup);
   

  const handleAddUserClick = () => {
    handleAddNewUser(newUser); 
  };

  return (
<div className="group-list">
      {/* <div className="group-heading">
        <h3>Groups</h3>
      </div> */}
       <h3 className='group-heading'>Groups</h3>

{/* Displaying groups in GroupManagement */}
{groups.length > 0 ? (
    <div className='groups-listing'>
      <ul>
          {groups.map((group, index) => (
            <li
              key={index}
              className={`group-item ${selectedGroup?.group_name === group.group_name ? 'active' : ''}`}
              onClick={() => handleGroupClick(group)}
            >
              {group.group_name}
              <button onClick={() => handleRemoveGroup(group.group_name)} className='remove-buttonn'>-</button>
            </li>
          ))}
      </ul>
        {groupRemoveError&&<p className='Error-Messages'>{groupRemoveError}</p>}
        {groupRemoveMessage&&<p className='Sucess-Messages'>{groupRemoveMessage}</p>}

    </div>
    ) : (
        <p>No groups available.</p>
)}




{/* Displaying users */}

{selectedGroup&&(
<div className='operation-div' >
<div className="dropdown-container-operation">
  <h3 className='users-heading' >Users</h3>

 {selectedGroup.users.length >= 6 &&<button 
           className="dropdown-button-operation" 
           onClick={() => setShowUserDropdown(!showUserDropdown)}
         >
        {showUserDropdown ? "Close users ▲":"Show users ▼"}
        </button>
}
{selectedGroup.users.length < 6  &&(
          <>
             <ul className='list-menu-users' >
             {selectedGroup.users.map((user, index) => (
               <li key={index}>
                 {user}
                 <button  onClick={() => handleRemoveUser(user)} className='remove-buttonn'>-</button>
               </li>
             ))}
       </ul>
       </>
)}

{showUserDropdown && (
          <ul className="dropdown-menu-users">
        {selectedGroup.users.length === 0 ? (
              <li className="dropdown-item-operation">No operations</li>
            ) : (
                  selectedGroup.users.map((user, index) => (
                <li key={index}  className="dropdown-item-operation">
                  {user}
                  <button
                    className="remove-button-operation"
                    onClick={(e) => {
                      //e.stopPropagation();
                       // Prevent dropdown from closing
                      setShowUserDropdown(false)
                      handleRemoveUser(user);
                    }}
                  >
                    ×
                  </button>
                </li>
              ))
            
          )}
          </ul>
          
        )}
    </div>


    <div>
          {!showUserDropdown&&
          <div className='add-users-group'>
            <button onClick={() => setIsAddUserVisible(!isAddUserVisible)} className="add-user-button">
                  {isAddUserVisible ? 'Cancel' : 'Add User'}
                </button>
                {isAddUserVisible && (
            <div className="add-users-form">
              <input
                type="text"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="Enter username"
              />
              <button onClick={handleAddUserClick}>Add User</button>
            </div>
              )}
          </div>}
             {addError && <p className='removeerror'>{addError}</p>}
              {userAddMessage && <p className='removemessage'>{userAddMessage}</p>}
              {removeError && <p className='user-remove-error'>{removeError}</p>}
              {userRemoveMessage && <p className='user-remove-message'>{userRemoveMessage}</p>}
        </div>
    </div>
)}
  



{/* Display Sources */}
{selectedSources.length > 0 && (
  <>
    <h3 className='sources-heading'>Sources</h3>
    <div className="group-sources">
      <ul>
              {selectedSources.map((source, index) => (
                <li 
                  key={index} 
                  className={selectedSource === source ? 'active' : ''}
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
    <h3 className='databases-heading'>Databases</h3>
    <div className="group-databases">
        <ul>
              {selectedDatabases.map((database, index) => (
                <li 
                  key={index}
                  className={selectedDatabase === database ? 'active' : ''}
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
    <h3 className='tables-heading'>Tables</h3>
      <div className="group-tables">
          <ul>
              {selectedTables.map((table, index) => (
                <li 
                  key={index}
                  className={selectedTable === table ? 'active' : ''}
                  onClick={() => handleTableClick(table)}
                >
                  {table}
                </li>
              ))}
          </ul>
      </div>
  </>
)}

{/*  View Email and Password    */}  
{viewEmailPass===true &&(
  <>
   <h3 className='tables-heading'>EmailPass</h3>
    <div className="viewemailpass">
          <div className="view-permissions">
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

  {/* <h3 className='show-ops-lable' > Operations</h3> */}
  <h3 className='operation-heading'>Operations</h3>
    {/*   <div className="dropdown-operation"> */}
  
    <div className="dropdown-container-operation">
    {selectedOperations.length>5 &&
        <button 
          className="dropdown-button-operation" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
        {showDropdown ? "Close operations ▲":"Show operations ▼"}
            </button>
    }
        {selectedOperations.length <=5&&
        <ul className='list-menu-operation' >
          
           {selectedOperations.map((operation, index) => (
         <li key={index} className="dropdown-item-operation">
         {operation}
          <button
           className="remove-button-operation"
           onClick={(e) => {
             // Prevent dropdown from closing
             //handleDeleteOperation(operation);
             handleDeleteOperation(
               selectedGroup.group_name,
               selectedSource,
               selectedDatabase,
               selectedTable,
               operation
             )
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
                <div className='dropdown-operation-list'>  
                <li key={index} className="dropdown-item-operation">
                  {operation}
                   <button
                    className="remove-button-operation"
                    onClick={(e) => {
                      setShowDropdown(false)
                      handleDeleteOperation(
                        selectedGroup.group_name,
                        selectedSource,
                        selectedDatabase,
                        selectedTable,
                        operation
                      )
                    }}
                  >
                     🗑
                  </button> 
                 
                </li>
                </div>
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
          <button onClick={handleAddOperation} >Add Operation</button>
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
  );

};

export default GroupList;
