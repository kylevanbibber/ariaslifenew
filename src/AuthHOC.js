// AuthHOC.js

import React, { useEffect } from 'react';

const AuthHOC = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    useEffect(() => {
      const jwtToken = localStorage.getItem('jwtToken');
      console.log("JWT Token:", jwtToken); // Log the token for debugging

      if (!jwtToken) {
        console.log("Redirecting to login"); // Log redirection
        window.location.href = 'https://ariaslife.com/agents/login.html';
      }
    }, []);

    console.log("Rendering WrappedComponent"); // Log rendering of the component
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default AuthHOC;
