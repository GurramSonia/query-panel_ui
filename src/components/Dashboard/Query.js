import React, { useState, useEffect } from 'react';
import PaginationControls from './PaginationControls.js';
import useTokenEffects from '../../hooks/useTokenEffects.js';
import usePasswordEncryptEffects from '../../hooks/usePasswordEncryptEffects.js';
//import axiosInstance from '../../axios'; // Adjust path as needed
import axios from '../../axios.js';
import '../../styles/Query.css';
import CryptoJS from "crypto-js";
import AutoSuggestQueryInput from './AutoSuggestQueryInput.js';
const QueryPanel = ({ paginate,availableDatabases,availableConnections,onDatabaseUpdate,userRole,availableDatabasesNames}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [database, setDatabase] = useState('selectDatabase');
  const [flashMessages, setFlashMessages] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const currentResults = paginate(results, currentPage, resultsPerPage); 
  const [submitted, setSubmitted] = useState(false); 
  const[messages,setMessages]=useState('')
  const [maskedConnection, setMaskedConnection] = useState('');
  const [originalConnection, setOriginalConnection] = useState('');
  const [databasesNames, setDatabasesNames] = useState('selectDatabase');
  const {token} = useTokenEffects();
   // Mask password in connection string
   const maskPassword = (connection) => {
     return connection.replace(/(:[^@]+)@/, ":****@");
   };
 
   // Restore the real password when sending the connection
   const restorePassword = (editedConn, fullConn) => {
     const fullPasswordMatch = fullConn.match(/:([^@]+)@/); // Extract original password
     const editedPasswordMatch = editedConn.match(/:([^@]*)@/); // Extract user-edited password
 
     if (!fullPasswordMatch || !editedPasswordMatch) return editedConn; 
 
     const originalPassword = fullPasswordMatch[1]; // Original password
     const editedPassword = editedPasswordMatch[1]; // User's input
 
     // If the edited password is '****', restore the original password
     return editedPassword === "****" ? editedConn.replace(/:([^@]*)@/, `:${originalPassword}@`) : editedConn;
   };
 
   useEffect(() => {
     if (availableConnections.length > 0) {
       const lastConnection = availableConnections[availableConnections.length - 1];
       setOriginalConnection(lastConnection);
       setMaskedConnection(maskPassword(lastConnection));
     }
   }, [availableConnections]);
 
   const handleInputChange = (event) => {
     setMaskedConnection(event.target.value);
   };
 
   const getFinalConnection = () => {
     return restorePassword(maskedConnection, originalConnection);
   };
  

/*   const key = CryptoJS.enc.Utf8.parse(token); // Token as key (must be 16/24/32 bytes)
  const iv = "1234567812345678";
  const encrypted = CryptoJS.AES.encrypt(getFinalConnection(), key, {
  iv: CryptoJS.enc.Utf8.parse(iv),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});
const encryptedconnection = encrypted.toString(); */
 const{encryptPassword,iv,}=usePasswordEncryptEffects(token);
 const  encryptedconnection=encryptPassword(getFinalConnection());

  
 


  

  
   const databasePlaceholders = {
    mysql: 'Write your MySQL query (e.g., SELECT * FROM table)',
    mongodb: 'Write your MongoDB query (e.g., db.collection.find({}) )',
   
  };
  const connectionURIPlaceholders={
    mongodb:"mongo string (mongodb://user:Password@service-name:port/database-name?authSource=admin)",
    mysql:'mysql string(mysql+pymysql://User:Password@service-name:port/database-name)',
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Query is required before submitting');
      setTimeout(() => setError(null), 3000); // Display an error
      return;
    }
    setResults([]);
    setError('');
    setFlashMessages([]);
 
    try {
      if(userRole==='admin'){
         const response = await axios.post('connection/query-connection', { query,database,maskedConnection: encryptedconnection,iv,token}, { withCredentials: true })
      
      
      if (response.data.error) {
        setError(response.data.error);
        setTimeout(() => setError(null), 3000);
      }
      if(response.data.results) {
        setResults(response.data.results || []);
        console.log(response.data.results)
        setError('')
        fetchPreviousQueries
      }
      if (response.data.flash_messages) {
          setFlashMessages('')
          setFlashMessages(response.data.flash_messages);
          console.log("flash messages:",response.data.flash_messages)
          setTimeout(() => setFlashMessages(null), 3000);
          fetchPreviousQueries
      }
      if (response.data.message) {
          setMessages(response.data.message);
          setTimeout(() => setMessages(null), 3000);
          console.log("messages",response.data.message)
        } 

      }
      else{
      const response = await axios.post('connection/query-connection-user', { query,database,databases_names:databasesNames}, { withCredentials: true })
      if (response.data.error) {
        setError(response.data.error);
        setTimeout(() => setError(null), 3000);
      }
      if(response.data.results) {
        setResults(response.data.results || []);
        console.log(response.data.results)
        setError('')
        fetchPreviousQueries
      }
      if (response.data.flash_messages) {
          setFlashMessages('')
          setFlashMessages(response.data.flash_messages);
          console.log("flash messages:",response.data.flash_messages)
          setTimeout(() => setFlashMessages(null), 3000);
          fetchPreviousQueries
      }
      if (response.data.message) {
          setMessages(response.data.message);
          setTimeout(() => setMessages(null), 3000);
          console.log("messages",response.data.message)
        } 

      }setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while executing the query.');
      console.log("err entetered into catch block")
      setTimeout(() => setError(null), 3000);
    }
  };
 
  const fetchTables = async () => {
  try {
    if(userRole==='admin'){
    //const response = await axios.post('connection/get-tables', { database,maskedConnection:getFinalConnection() }, { withCredentials: true });
    const response = await axios.post('connection/get-tables', { database,maskedConnection: encryptedconnection,iv,token  }, { withCredentials: true })
 
    if (response.data.tables) {
      console.log("tables",response.data.tables)
      return response.data.tables
    }
  }

else{
  if(databasesNames!=='selectDatabase'&&databasesNames!==""){
  const response = await axiosInstance.post('connection/get-tables-user', { database,databases_names:databasesNames}, { withCredentials: true });
    if (response.data.tables) {
      console.log("tables",response.data.tables)
      return response.data.tables
    }

}
}
  }
  catch (err) {
    setError(err.response?.data?.error || 'An error occurred while fetchingthe tables.');
    console.log("err entetered into catch block")
    setTimeout(() => setError(null), 5000);
  }
  
};

const fetchPreviousQueries = async () => {
  try {
    const response = await axios.post('connection/previous-queries',{ database},{ withCredentials: true });
    if (response.data.queries) {
      const uniqueQueries = [...new Set(response.data.queries)]; // Removes duplicates
      return uniqueQueries;
    }
  }
  catch (err) {
    setError(err.response?.data?.error || 'An error occurred while fetching the prev queries.');
    console.log("err entetered into catch block")
    setTimeout(() => setError(null), 5000);
  }
  
// Restore the original password
};
const handleDatabaseChange = (event) => {
  const selectedDB = event.target.value;
  setDatabase(selectedDB);

  // Notify the parent of the new selection
  if (onDatabaseUpdate) {
    onDatabaseUpdate(selectedDB);
  }
}



  return(
    <div className="dashboard-container">
      <h2 className="dashboard-heading">QueryForm</h2>
      <form className="dashboard-form" onSubmit={handleSubmit}>

        {/* Database Selection */}

        <div className="dashboard-database-select">
            {availableDatabases.length > 0 ? (
              <>
              <label htmlFor="database-select">Choose source:</label>
              <select
                id="database-select"
                value={database}
                onChange={(e) => handleDatabaseChange(e)}
                required
              >
                
                <option value="">Select Source</option>
                {availableDatabases.map((db, index) => (
                  <option key={index} value={db}>
                    {db.charAt(0).toUpperCase() + db.slice(1)} {/* Capitalize the name */}
                  </option>
                ))}
              </select>
              </>
            ) : (
              <p className="dashboard-no-databases">No Sources available for this user.</p>
            )}
        </div>

       {/* Masked Connection String */}
       {userRole==='admin'&&(database==="mysql"||database==="mongodb")&&(<>
       <label>Connection String:</label>
      <textarea
        value={maskedConnection}
        onChange={handleInputChange}
        placeholder={connectionURIPlaceholders[database] || 'Enter your connection uri'}
        required

      />
      </>)}
      {userRole!=='admin'&&(database==="mysql"||database==="mongodb")&&<>
      {availableDatabasesNames.length > 0 ? (
        <>
        <label htmlFor="database-select">Choose Database names:</label>
        <select
          id="database-select"
          value={databasesNames}
          onChange={(e)=>setDatabasesNames(e.target.value)}
          required
        >
          
          <option value="">Select Database</option>
          {availableDatabasesNames.map((db, index) => (
            <option key={index} value={db}>
            {db}
            </option>
          ))}
        </select>
       
        </>
      ) : (
        <p className="dashboard-no-databases">No databases available.</p>
      )}</>}
       

        {/*Query text area */}
        <AutoSuggestQueryInput fetchTables={fetchTables} fetchPreviousQueries={fetchPreviousQueries} query={query} setQuery={setQuery} setResults={setResults} submitted={submitted}setSubmitted={setSubmitted} connectionURI={maskedConnection} database={database} results={results} databases_names={databasesNames}/>

        {/*Query submit button */}
        <button type="submit" className="dashboard-submit-button">Execute Query</button>
      </form>
{/* Displays error if exists */}
        {error && <p className="dashboard-error">{error}</p>}

{/* Display flash messages */}
        {flashMessages &&
      flashMessages.map((msg, index) => (
        <p key={index} className="dashboard-flash-message">{msg}</p>
      ))}
      {messages &&<p>{messages}</p>}

{/* Display query results */}
      {results.length > 0 && (
      <>
      <p className='query-results-para'>QUERY RESULTS </p>
      <div className="table1">
        <table className="dashboard-results-table">
          <thead>
            <tr>{Object.keys(results[0]).map((key) => <th key={key}>{key}</th>)}</tr>
          </thead>
          <tbody>
            {currentResults.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i} title={String(value)}>
                    {typeof value === 'string' && value.length > 20 ? `${value.slice(0, 20)}...` : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationControls
          currentPage={currentPage}
          totalPages={Math.ceil(results.length / resultsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
      </>
     )}
    </div>
  );
}

export default QueryPanel;
