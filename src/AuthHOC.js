// AuthHOC.js

import React, { useEffect } from 'react';

const AuthHOC = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    useEffect(() => {
      // Check if the user is authenticated
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        // User is not authenticated, redirect to the login page
        window.location.href = 'https://ariaslife.com/agents/login.html'; // Replace with your login URL
      }
      // Add any other conditions or handling as needed
    }, []);

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default AuthHOC;
