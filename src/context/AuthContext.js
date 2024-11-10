import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Check for saved user data (token) in localStorage on initial load
    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('jwtToken'));
        if (savedUser) {
            setUser(savedUser);
            setToken(savedUser.token);
        }
    }, []);

    // Login function: Save user and token in state and localStorage
    const login = (token, userData) => {
        const userWithToken = {
            ...userData,
            token,
        };
        setUser(userWithToken);
        setToken(token);
        localStorage.setItem('jwtToken', JSON.stringify(userWithToken)); // Store user data in localStorage
    };

    // Logout function: Clear user data and remove token from localStorage
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('jwtToken'); // Remove user data from localStorage
    };

    return ( <
        AuthContext.Provider value = {
            { user, token, login, logout } } > { children } <
        /AuthContext.Provider>
    );
};