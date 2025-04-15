import { useState, useEffect } from 'react';
import axiosInstance from '../axios';
const useUserManagementEffects = () => {
    const [userOperations, setUserOperations] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedOperations, setSelectedOperations] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newOperation, setNewOperation] = useState(''); // For adding operation
  const [opRemoveError, setOpRemoveError] = useState(''); 
  const [opRemoveMessage, setOpRemoveMessage] = useState(''); 
  const [opAddError, setOpAddError] = useState('');
  const [opAddMessage, setOpAddMessage] = useState('');
  const [isAddOperationVisible, setIsAddOperationVisible] = useState(false);
  const [userRemoveError, setUserRemoveError] = useState(''); 
  const [userRemoveMessage, setUserRemoveMessage] = useState(''); 
  const [viewEmail, setViewEmail] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const[viewEmailPass,setViewEmailPass]=useState(false)
  const [viewEmailChange, setViewEmailChange] = useState(false);
  const [viewPassChange, setViewPassChange] = useState(false);
  const[emailPassMessage,setEmailPassMessage]=useState('')
  const[emailPassError,setEmailPassError]=useState(false)
  const[isUpdateEmailPassVisible,setIsUpdateEmailPassVisible]=useState(false) 
  const[showDropdown,setShowDropdown]=useState([])
    useEffect(() => {
        fetchAllOperations();
      }, []);
    
      const fetchAllOperations = async () => {
        try {
          const response = await axiosInstance.get('admin/user-operations', { withCredentials: true });
          console.log("Fetched Operations:", response.data);
    
          setUserOperations(response.data);
          setUsers(Object.keys(response.data)); // Extract usernames
        } catch (error) {
          console.error('Error fetching operations:', error);
        }
      };
    
      const handleUserClick = (username) => {
        setSelectedUser(username);
        //setShowDropdown(!showDropdown)
        setShowDropdown(false)
        setViewEmailPass(false)
        // Extract sources (e.g., "mysql")
        const availableSources = Object.keys(userOperations[username] || {});
    
        setSelectedSources(availableSources);
        setSelectedDatabases([]); // Reset databases when user changes
        setSelectedTables([]);
        setSelectedOperations([]);
        setSelectedSource(null);
        setSelectedDatabase(null);
        setSelectedTable(null);
      };
    
      const handleSourceClick = (source) => {
        setSelectedSource(source);
    
        // Extract databases under the selected source
        const availableDatabases = Object.keys(userOperations[selectedUser]?.[source] || {});
    
        setSelectedDatabases(availableDatabases);
        setSelectedTables([]);
        setSelectedOperations([]);
        setSelectedDatabase(null);
        setSelectedTable(null);
      };
    
      const handleDatabaseClick = (database) => {
        setSelectedDatabase(database);
    
        // Extract tables under the selected database
        const availableTables = Object.keys(userOperations[selectedUser]?.[selectedSource]?.[database] || {});
    
        setSelectedTables(availableTables);
        setSelectedOperations([]);
        setSelectedTable(null);
      };
    
      const handleTableClick = (table) => {
        setSelectedTable(table);
    
        // Get the table's data (operations, view_email, view_pass)
        const tableData = userOperations[selectedUser]?.[selectedSource]?.[selectedDatabase]?.[table] || [];
    
        if (tableData) {
            setSelectedOperations(tableData.operations || []);
            setViewEmail(tableData.view_email === 1); // Convert 1 to true, 0 to false
            setViewPass(tableData.view_pass === 1);
            setViewEmailPass(true)
        } else {
            setSelectedOperations([]);
            setViewEmail(false);
            setViewPass(false);
            setViewEmailPass(false)
        }
    };
    
      const handleAddOperation = async () => {
        if (!selectedUser || !selectedSource || !selectedDatabase || !selectedTable || !newOperation) {
          alert("Please select user, source, database, table, and enter an operation.");
          return;
        }
    
        try {
          const response = await axiosInstance.post('admin/user_operation_add', {
            user_name: selectedUser,
            source: selectedSource,
            database: selectedDatabase,
            table: selectedTable,
            operation: newOperation
          });
          if(response.data.message){
          //alert(response.data.message);
          setSelectedOperations([...selectedOperations, newOperation]); // Update UI
          setOpAddMessage(`${newOperation} operation added successfully`);
          setTimeout(() => setOpAddMessage(''), 3000);
          setNewOperation(''); 
          setIsAddOperationVisible(false);
          }// Reset input field
          else {
            setOpAddError(response.data.error);
            setTimeout(() => setOpAddError(''), 3000);
          }
        } catch (error) {
          console.error('Error adding operation:', error);
          setOpAddError(`Error adding ${newOperation} operation:`);
        }
      };
    const handleRemoveOperation = async (operation) => {
        
        if (!window.confirm(`Are you sure you want to remove "${operation}"? operation`)) return;
    
        try {
          const response = await axiosInstance.post('admin/user_operation_remove', {
            user_name: selectedUser,
            source: selectedSource,
            database: selectedDatabase,
            table: selectedTable,
            operation: operation
          });
          if (response.data.message) {
          //alert(response.data.message);
          setSelectedOperations(selectedOperations.filter(op => op !== operation)); // Update UI
          setNewOperation('');
          setOpRemoveError('')
            setOpRemoveMessage(`'${operation}' removed successfull`);
            setTimeout(() =>setOpRemoveMessage (''), 3000); 
          }
          else {
            setOpRemoveError(response.data.error);  // Set error message
            setTimeout(() => setOpRemoveError(''), 3000);  // Clear error message after a timeout
          }
    
        } catch (error) {
          console.error('Error removing operation:', error);
          setOpRemoveError(`Error in removing '${operation}' operation`);  // Set error message
          setTimeout(() => setOpRemoveError(''), 3000);  
        }
      }
    
    
    
      const handleRemoveUser = async (username) => {
        if (!window.confirm(`Are you sure you want to remove  "${username}"? user `)) return;
    
        try {
          const response = await axiosInstance.post('admin/remove-user-usermangement', { username });
          //alert(response.data.message);
          
          // Remove user from state after successful deletion
          if (response.data.message) {
          const updatedUsers = users.filter(user => user !== username);
          setUsers(updatedUsers);
    
          if (selectedUser === username) {
            setSelectedUser(null);
            setSelectedSources([]);
            setSelectedDatabases([]);
            setSelectedTables([]);
            setSelectedOperations([]);
          }
          setUserRemoveMessage(response.data.message)
          setTimeout(() =>setUserRemoveMessage(''), 3000);  
        } 
      }
        catch (error) {
          console.error('Error removing user:', error);
          setUserRemoveError("Error in removing user")
          setTimeout(() =>setUserError(''), 3000);  
        }
      };
    
    
      const handleUpdateEmailPass = async () => {
        try {
         const response = await axiosInstance.post("admin/update-user-email-pass", {
            user_name: selectedUser,
            source: selectedSource,
            database: selectedDatabase,
            table: selectedTable,
            view_email: viewEmailChange ? 1 : 0, 
            view_pass: viewPassChange ? 1 : 0, 
          });
    
          if (response.data.message) {
            setEmailPassMessage(response.data.message||"Permissions updated successfully!");
            setViewEmail(viewEmailChange); // Update state only if the request is successful
            setViewPass(viewPassChange); 
            setViewEmailChange('')
            setViewPassChange('')
            setIsUpdateEmailPassVisible(false)
            setTimeout(() => setEmailPassMessage(''), 3000);
          } else {
            setEmailPassError(response.data.error||"Failed to update permissions.");
            setTimeout(() => setEmailPassError(''), 3000);
          }
        } catch (error) {
          setEmailPassError(err.response.data.error||"Error updating permissions.");
          setTimeout(() => setEmailPassError(''), 3000);
        }
      };
    
  return {
        userOperations,
        users,
        selectedUser,
        selectedSources,
        selectedDatabases,
        selectedTables,
        selectedOperations,
        selectedSource,
        selectedDatabase,
        selectedTable,
        viewEmail,viewPass,viewEmailPass,viewEmailChange,viewPassChange,setViewEmail,setViewPass,setViewEmailChange,setViewPassChange,
        opRemoveError,
        opAddError,
        opAddMessage,
        opRemoveMessage,
        userRemoveMessage,userRemoveError,
        emailPassMessage,
        emailPassError,
        isAddOperationVisible,
        setIsAddOperationVisible,
        handleSourceClick,
        handleDatabaseClick,
        handleTableClick,
        handleRemoveOperation,
        handleRemoveUser,
        handleUserClick,
        handleAddOperation,
        handleUpdateEmailPass,
        isUpdateEmailPassVisible,
        setIsUpdateEmailPassVisible,newOperation,setNewOperation,
        showDropdown,setShowDropdown
      };


};

export default useUserManagementEffects;