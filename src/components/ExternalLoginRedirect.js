// ExternalLoginRedirect.js

import { useEffect } from 'react';

const ExternalLoginRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://ariaslife.com/agents/login.html';
  }, []);

  return null; // or some loading indicator
};

export default ExternalLoginRedirect;
