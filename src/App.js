import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Production from './components/Production';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Assuming the token is returned in the query params as ?token=abc
        const { search } = window.location;
        const params = new URLSearchParams(search);
        const token = params.get('token');
        if (token) {
            // Validate the token and set isAuthenticated accordingly
            // For example, you could send the token to your backend to validate it
            setIsAuthenticated(true);
            // Optionally remove the token from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const PrivateRoute = ({ children }) => {
        if (!isAuthenticated) {
            window.location.href = 'https://ariaslife.com/agents/login.html';
            return null;
        }
        return children;
    };

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/production" element={<PrivateRoute><Production /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
