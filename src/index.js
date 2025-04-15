/* import React from 'react';
import ReactDOM from 'react-dom/client'; // Change to 'react-dom/client' for React 18+
//import './App.css';
import './styles/App.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root

 root.render(
  <Router>
    <App />
  </Router>
);  */ 

import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+ uses this import
import './styles/App.css'; // Your stylesheet
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <BrowserRouter basename="/query-ui"> 
    <App />
  </BrowserRouter>
); 