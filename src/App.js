import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './App.css'; // Include your global CSS here
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div>
            <Navbar />
            <Dashboard />
        </div>
    );
}

export default App;
