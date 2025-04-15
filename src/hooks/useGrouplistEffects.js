// src/hooks/useUserlistEffects.js
import { useState, useEffect } from 'react';
import axiosInstance from '../axios'; // Ensure axios instance is correctly imported

const useGrouplistEffects = (selectedGroup) => {
  const [groupOperations, setGroupOperations] = useState({});
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedOperations, setSelectedOperations] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newUser, setNewUser] = useState(''); 
  const [newOperation, setNewOperation] = useState('');
  const [opAddError, setOpAddError] = useState('');
  const [opRemoveError, setOpRemoveError] = useState('');
  const [opRemoveMessage, setOpRemoveMessage] = useState('');
  const [opAddMessage, setOpAddMessage] = useState('');
  const [viewEmail, setViewEmail] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const [viewEmailChange, setViewEmailChange] = useState(false);
  const [viewPassChange, setViewPassChange] = useState(false);
  const[viewEmailPass,setViewEmailPass]=useState(false)
  const [emailPassMessage, setEmailPassMessage] = useState('');
  const [emailPassError, setEmailPassError] = useState(false);
  const[isUpdateEmailPassVisible,setIsUpdateEmailPassVisible]=useState(false)
  const [isAddOperationVisible, setIsAddOperationVisible] = useState(false);

  //const [selectedGroup, setSelectedGroup] = useState(null); // Assuming this is passed as a prop or managed globally

  useEffect(() => {
    if (selectedGroup) {
        fetchAllOperations();
    }
}, [selectedGroup]);
  useEffect(() => {
    if (selectedGroup) {
      const sources = Object.keys(groupOperations[selectedGroup.group_name] || {});
      setSelectedSources(sources);
       resetSelections(); 
    }
  }, [selectedGroup, groupOperations]);

   const resetSelections = () => {
    setSelectedDatabases([]);
    setSelectedTables([]);
    setSelectedOperations([]);
    setSelectedSource(null);
    setSelectedDatabase(null);
    setSelectedTable(null);
    setViewEmail(false);
    setViewPass(false);
    setEmailPassMessage('');
  }; 

   const fetchAllOperations = async () => {
    try {
      const response = await axiosInstance.get('admin/group-operations', { withCredentials: true });
      setGroupOperations(response.data);
      console.log("Group Operations data:", response.data);

    } catch (error) {
      console.error('Error fetching operations:', error);
    }
  }; 

  const handleSourceClick = (source) => {
    setSelectedSource(source);
    const databases = Object.keys(groupOperations[selectedGroup.group_name]?.[source] || {});
    console.log("entered into handle source click")
    setSelectedDatabases(databases);
    setSelectedTables([]);
    setSelectedOperations([]);
    setSelectedDatabase(null);
    setSelectedTable(null);
    setViewEmailPass(false)
  };

  const handleDatabaseClick = (database) => {
    setSelectedDatabase(database);
    const tables = Object.keys(groupOperations[selectedGroup.group_name]?.[selectedSource]?.[database] || {});
    setSelectedTables(tables);
    setSelectedOperations([]);
    setSelectedTable(null);
    setViewEmail(false)
    setViewPass(false)
    setViewEmailPass(false)
    
    
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    const tableData = groupOperations[selectedGroup.group_name]?.[selectedSource]?.[selectedDatabase]?.[table];

    if (tableData) {
      setSelectedOperations(tableData.operations || []);
      setViewEmail(tableData.view_email === 1); 
      setViewPass(tableData.view_pass === 1);
      setViewEmailPass(true)
    } else {
      setSelectedOperations([]);
      setViewEmail(false);
      setViewPass(false);
      setViewEmailPass(false)
    }
  };
  const handleDeleteOperation = async (groupName, source, database, table, operation) => {
    console.log("remove operation is",operation)
    if (!window.confirm(`Are you sure you want to remove  "${operation}"? operation`)) return;
    try {
      const response = await axiosInstance.post("admin/group_operation_remove", {
        group_name: groupName,
        source:source,
        database:database,
       table:table,
       operation:operation
      });
  
  
      if (response.data.message) {
        console.log(`Operation '${operation}' deleted successfully`);
        setSelectedOperations((prevOperations) => {
          const updatedOperations = [...prevOperations];
          const operationIndex = updatedOperations.indexOf(operation);
          
          if (operationIndex > -1) {
            updatedOperations.splice(operationIndex, 1); 
          }
          return updatedOperations;
        });
        setSelectedSource(selectedSource); 
        setSelectedTable(selectedTable);
        setOpRemoveError('')
        setOpRemoveMessage(`'${operation}' removed successfull`);
        setTimeout(() =>setOpRemoveMessage (''), 3000); 
      }
      else {
        setOpRemoveError(response.data.error);  
        setTimeout(() => setOpRemoveError(''), 3000);  
      }
    } catch (error) {
      console.error(`Error deleting operation '${operation}':`, error);
      setOpRemoveError(`Error deleting operation '${operation}':`, error);  
      setTimeout(() => setOpRemoveError(''), 3000);
    }
  };

  const handleAddOperation = async () => {
    if (!newOperation.trim()) {
      setOpAddError("Operation cannot be empty");
      setTimeout(() => setOpAddError(''), 3000);
      return;
    }

    try {
      const response = await axiosInstance.post("admin/group_operation_add", {
        group_name: selectedGroup.group_name,
        source: selectedSource,
        database: selectedDatabase,
        table: selectedTable,
        operation: newOperation
      });

      if (response.data.message) {
        console.log(`Operation '${newOperation}' added successfully`);

        setSelectedOperations((prevOperations) => [...prevOperations, newOperation]);
        setOpAddMessage(`${newOperation} operation added successfull`);
        setTimeout(() => setOpAddMessage(''), 3000);
        setNewOperation('');
        setIsAddOperationVisible(false);
      } else {
        setOpAddError(response.data.error);
        setTimeout(() => setOpAddError(''), 3000);
      }
    } catch (error) {
      console.error(`Error adding operation '${newOperation}':`, error);
    }
  };

  const handleUpdateEmailPass = async () => {
    try {
      const response = await axiosInstance.post("admin/update-group-email-pass", {
        group_name: selectedGroup.group_name,
        source: selectedSource,
        database: selectedDatabase,
        table: selectedTable,
        view_email: viewEmailChange ? 1 : 0,
        view_pass: viewPassChange ? 1 : 0,
      });

      if (response.data.message) {
        setEmailPassMessage(response.data.message || 'Permissions updated successfully');
        setViewEmail(viewEmailChange); 
        setViewPass(viewPassChange); 
        setViewEmailChange('')
        setViewPassChange('')
        setIsUpdateEmailPassVisible(false)
        setTimeout(() => setEmailPassMessage(''), 3000);
      } else {
        setEmailPassError(response.data.error || 'Failed to update permissions');
        setTimeout(() => setEmailPassError(''), 3000);
      }
    } catch (error) {
      setEmailPassError(error?.response?.data?.error || 'Error updating permissions');
      setTimeout(() => setEmailPassError(''), 3000);
    }
  };

/*   const handleAddUserClick = () => {
    handleAddNewUser(newUser); 
  } */

  return {
    groupOperations,
    selectedSources,
    selectedDatabases,
    selectedTables,
    selectedOperations,
    selectedSource,
    selectedDatabase,
    selectedTable,
    newUser,
    setNewUser,
    viewEmail,viewPass,viewEmailPass,viewEmailChange,viewPassChange,setViewEmail,setViewPass,setViewEmailChange,setViewPassChange,setViewEmailPass,
    opRemoveError,
    opAddError,
    opAddMessage,
    opRemoveMessage,
    emailPassMessage,
    emailPassError,
    isAddOperationVisible,
    setIsAddOperationVisible,
    //handleAddUserClick,
    handleSourceClick,
    handleDatabaseClick,
    handleTableClick,
    handleDeleteOperation,
    handleAddOperation,
    handleUpdateEmailPass,
    isUpdateEmailPassVisible,
    setIsUpdateEmailPassVisible,newOperation,setNewOperation,
  };

};

export default useGrouplistEffects;
