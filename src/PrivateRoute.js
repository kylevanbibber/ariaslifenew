import React, { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  useEffect(() => {
    // Check if the user is authenticated
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      // User is not authenticated, handle as needed (e.g., redirect to login)
      // You can also store the intended URL and redirect back after login
      // For simplicity, we're using Navigate here to redirect to the login page
      Navigate('/login');
    }
    // Add any other conditions or handling as needed

  }, []);

  return <Route element={<Component />} />;
};

export default PrivateRoute;
