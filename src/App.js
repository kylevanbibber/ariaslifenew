import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Production from './components/Production';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
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
