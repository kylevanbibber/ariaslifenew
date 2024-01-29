// In ./components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');

  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/login" />;
  }

  // Render children if token is present
  return children;
};

export default ProtectedRoute;
