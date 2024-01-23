// App.js
import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Production from './components/Production';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthHOC from './AuthHOC'; // Import the AuthHOC
import ExternalLoginRedirect from './components/ExternalLoginRedirect'; // Import the ExternalLoginRedirect component
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={AuthHOC(Dashboard)} /> {/* Protected route */}
        <Route path="/production" element={AuthHOC(Production)} /> {/* Protected route */}
      </Routes>
    </Router>
  );
}

export default App;
