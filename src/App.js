import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Production from './components/Production';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    useEffect(() => {
        // Check if the user is authenticated
        const jwtToken = localStorage.getItem('jwtToken');

        if (!jwtToken) {
            // User is not authenticated, redirect to the login page
            window.location.href = 'https://ariaslife.com/agents/login.html'; // Replace with your login URL
        }
        // Add any other conditions or handling as needed

    }, []);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" exact element={<Dashboard />} />
                <Route path="/production" element={<Production />} />
            </Routes>
        </Router>
    );
}

export default App;
