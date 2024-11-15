import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwtToken')); // Get token from localStorage

    useEffect(() => {
        if (token) {
            try {
                // Decode the JWT token and check if it's valid (e.g., expired)
                const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the payload
                const expiryTime = decoded.exp * 1000; // Token expiry time (convert to ms)

                if (expiryTime < Date.now()) {
                    // If the token is expired, clear it from localStorage and reset state
                    throw new Error('Token expired');
                }

                setUser(decoded.user); // Set user data from decoded token
            } catch (error) {
                console.error('Invalid or expired token', error);
                setToken(null); // Clear invalid token
                setUser(null); // Clear user data
                localStorage.removeItem('jwtToken'); // Remove invalid token from localStorage
            }
        }
    }, [token]);

    const login = (newToken, newUser) => {
        localStorage.setItem('jwtToken', newToken); // Save the new token to localStorage
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken'); // Remove token from localStorage
        setToken(null);
        setUser(null);
    };

    return ( <
        AuthContext.Provider value = {
            { user, token, login, logout } } > { children } <
        /AuthContext.Provider>
    );
};