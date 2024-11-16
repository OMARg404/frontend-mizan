import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for routing

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwtToken')); // Initial token from localStorage
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                const expiryTime = decoded.exp * 1000;

                if (expiryTime < Date.now()) {
                    throw new Error('Token expired');
                }

                setUser(decoded.user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Invalid or expired token', error);
                localStorage.removeItem('jwtToken');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
                navigate('/'); // Redirect to login if the token is invalid
            }
        } else {
            setIsAuthenticated(false); // If no token exists
        }
    }, [token, navigate]);

    const login = (newToken, newUser) => {
        localStorage.setItem('jwtToken', newToken);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        navigate('/dashboard'); // Redirect to dashboard after login
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login'); // Redirect to login page after logout
    };

    return ( <
        AuthContext.Provider value = {
            { user, token, login, logout, isAuthenticated } } > { children } <
        /AuthContext.Provider>
    );
};