import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const withAdminAuth = (WrappedComponent) => {
  return (props) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (!user || user.isAdmin === undefined || !user.isAdmin) {
        // If the user is not logged in or not an admin, display an alert and navigate away
        alert('You do not have permission to access this page.');
        logout(); // Call logout function to clear user data
        navigate('/home'); // Redirect to the home page or login page
      }
    }, [user, navigate, logout]); // Dependency array to rerun effect when user, navigate, or logout changes

    // If the user is an admin, render the wrapped component
    return user && user.isAdmin ? <WrappedComponent {...props} /> : null;
  };
};

export default withAdminAuth;
