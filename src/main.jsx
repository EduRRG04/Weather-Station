import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/*
  
  TODO: Remove unused files from the project. Estado: HECHO

  TODO: Improve login from design

  TODO: Create a Loader when the session is getting fetched

  TODO: Create a Dashboard

  TODO: Create a Table component to retrieve all entries from the DB

  TODO: Use react Context to share the session between components?

  TODO: Create a map component to show the location of the sensor nodes 

  TODO: Use TensorFlow.js to create a linear regression from meassurements
*/
