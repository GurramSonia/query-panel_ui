
import React, { useState, useEffect } from 'react';
import {  useParams,useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../axios';  // Goes up two levels to reach src
import QueryPanel from './Query.js';
import AuditLogs from './AuditLogs.js';
import UserInterface from './UserInterface.js';
import UserLists from './UserLists.js';
import '../../styles/Dashboard.css';
import PermissionsForm from './GroupPermissionForm.js';
import UserpermissionsForm from './UserPermissionForm.js';
import GroupManagement from './GroupManagement.js';
import UserManagement from './UserManagement.js';
import useDashboardEffects from '../../hooks/useDashboardEffects.js';



const Dashboard = () => {
  const navigate = useNavigate();
  const [showInterface, setShowInterface] = useState(false);
  const[viewGroupManagement,setviewGroupManagement]=useState(false);
  const[viewUserManagement,setviewUserManagement]=useState(false);
  const [availableConnections, setAvailableConnections] = useState([]);
  const [availableDatabasesNames, setAvailableDatabaseNames] = useState([]);
  const [receivedDatabase, setReceivedDatabase] = useState("");
  const {
    flashMessage,userInitial,username,userRole,activeSection,showUserDropdown,showGroupDropdown,
    admins,nonAdmins,userError,availableDatabases,groups,setGroups,showAddContainer,paginate,
    handleUserDropdown,handleGroupDropdown,setActiveSection,setShowAddContainer,
  } = useDashboardEffects(navigate);

  const toggleAddContainer = () => {
    setShowAddContainer(!showAddContainer);
  }; 
  const toggleUserManagement = () => {
    setviewUserManagement((prev) => {
        const newState = !prev;
        if (newState) setviewGroupManagement(false);  // Close Group Management if User Management opens
        return newState;
    });
};
const handleDatabaseUpdate = (database) => {
  console.log("Received in Dashboard:", database);
  setReceivedDatabase(database); // Store the received database
};

useEffect(() => {
  if (activeSection === 'queryPanel' && receivedDatabase) {
    const fetchAvailableConnections = async () => {
      try {
        const response = await axiosInstance.post(
          '/admin/available_connections',
          { database: receivedDatabase },   // ✅ Send selected database
          { withCredentials: true }
        );
        console.log("Connections for database:", receivedDatabase, response.data);
        setAvailableConnections(response.data);
      } catch (err) {
        console.error('Failed to fetch connections:', err);
        setAvailableConnections([]);
      }
    };
    fetchAvailableConnections();
  }
}, [activeSection, receivedDatabase]); 

useEffect(() => {
  if (activeSection === 'queryPanel' && receivedDatabase) {
    const fetchAvailableDatabasenames = async () => {
      try {
        const response = await axiosInstance.post(
          '/admin/available_databases_names',
          { database: receivedDatabase },   // ✅ Send selected database
          { withCredentials: true }
        );
        console.log("Connections for database:", receivedDatabase, response.data);
        setAvailableDatabaseNames(response.data);
      } catch (err) {
        console.error('Failed to fetch connections:', err);
        setAvailableDatabaseNames([]);
      }
    };
    fetchAvailableDatabasenames();
  }
}, [activeSection, receivedDatabase]); 
// Toggle Group Management
const toggleGroupManagement = () => {
    setviewGroupManagement((prev) => {
        const newState = !prev;
        if (newState) setviewUserManagement(false);  // Close User Management if Group Management opens
        return newState;
    });
};
const toggleAuditLogs=()=>{
  setviewGroupManagement(false)
  setviewUserManagement(false)
  setActiveSection('audit_logs')
}

 

  return (
    <div >
     
       <div className="query-panel-heading" onClick={() => setActiveSection('queryPanel')}role="button"
       tabIndex={0}>QueryPanel</div>
      <div className='flash-message-container'>
      {flashMessage && <p className="success-message">{flashMessage}</p>}
      
    
      </div>
      
{/*Display user interface */}

      <UserInterface username={username} userInitial={userInitial}
        handleLogout={() => {
          localStorage.removeItem('userId');
          localStorage.removeItem('userInitial');
          localStorage.removeItem('userrole');
          localStorage.removeItem('username');
          navigate('/query-login');
        }}
        showInterface={showInterface}
        toggleInterface={() => setShowInterface(!showInterface)}
      />


{userRole === 'admin' && (
                <div className='container-example'>
                    <div className='sidebar'>

                        {/* Audit Logs Button */}
                       
                        <div className='audit-logs-button'>
                         <button
                            onClick={toggleAuditLogs} className={activeSection === 'audit_logs' ? 'active' : ''} id='audit-log-button' >   ViewAuditLogs </button>
                        </div>

                        {/* User Management Section */}
                        <button onClick={toggleUserManagement} id='user-management-button'> 
                          {/*   {viewUserManagement ? 'Cancel User Management' : 'Show User Management'} */}
                            { viewUserManagement ? ' UserManagement▼':'UserManagement▲'}
                            
                        </button>
 
                        {viewUserManagement && (
                            <div className='submenu-container'>
                                <button
                                    onClick={() => setActiveSection('users')}
                                    className={activeSection === 'users' ? 'active' : ''}
                                >
                                    Users
                                </button>
                                <button
                                    onClick={() => setActiveSection('user-permission')}
                                    className={activeSection === 'user-permission' ? 'active' : ''}
                                >
                                    SetUserPermissions
                                </button>
                                <button
                                    onClick={() => setActiveSection('user-management')}
                                    className={activeSection === 'user-management' ? 'active' : ''}
                                >
                                    UserManagement
                                </button>
                               {/*  <button
                                    onClick={() => setActiveSection('addUser')}
                                    className={activeSection === 'addUser' ? 'active' : ''}
                                >
                                    Add User
                                </button> */}
                            </div> 
)}

                        {/* Group Management Section */}
                        <button onClick={toggleGroupManagement} id='group-management-button'>
                          {/*   {viewGroupManagement ? 'Cancel Group Management' : 'Show Group Management'} */}
                            { viewGroupManagement ? ' GroupManagement▼':'GroupManagement▲'}
                        </button>

                        {viewGroupManagement && (
                            <div className='submenu-container'>
                                <button
                                    onClick={() => setActiveSection('group-permissions')}
                                    className={activeSection === 'group-permissions' ? 'active' : ''}
                                >
                                    SetGroupPermissions
                                </button>
                                <button
                                    onClick={() => setActiveSection('group-management')}
                                    className={activeSection === 'group-management' ? 'active' : ''}
                                >
                                    GroupManagement
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

{/* Query Panel Component */}
      {activeSection === 'queryPanel' && (
      <QueryPanel paginate={paginate}availableDatabases={availableDatabases} availableConnections={availableConnections} onDatabaseUpdate={handleDatabaseUpdate}userRole={userRole} availableDatabasesNames={availableDatabasesNames}></QueryPanel>
       )}
  
{/* Audit_logs component */}
      {activeSection === 'audit_logs' && (
        <AuditLogs activeSection={activeSection} paginate={paginate} />
      )}

{/* permission form component */}
      {activeSection === 'group-permissions' && <PermissionsForm  groups={groups} />}

{/* User Permissions Componenet */}
      {activeSection === 'user-permission' && <UserpermissionsForm  admins={admins} nonAdmins={nonAdmins}  />}

{/* Add User Component */}
    {/*   {activeSection === 'addUser' && <AddUser />}  */}
      
{/* User list Component */}
      {(activeSection === 'users'|| activeSection==='admins'||activeSection==='nonAdmins'||activeSection==='addUser') && <UserLists admins={admins} nonAdmins={nonAdmins} error={userError} activeSection={activeSection} setActiveSection={setActiveSection}/>}

{/* Group Management Component  */}
      {(activeSection=='group-management'||activeSection==='add-group') &&   <GroupManagement
        groups={groups}
        setGroups={setGroups}
        showAddContainer={showAddContainer}
        toggleAddContainer={toggleAddContainer}
        admins={admins} nonAdmins={nonAdmins} activeSection={activeSection} setActiveSection={setActiveSection}
      />}
        {activeSection=='user-management' &&   <UserManagement/>} 
      </div> 
  );
}

export default Dashboard;
