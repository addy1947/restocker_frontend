import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // Verify token with backend
                    const response = await axios.get('http://localhost:5000/api/auth/verify', {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    });
                    setUser(response.data.user);
                    setToken(storedToken);
                } catch (error) {
                    // Token is invalid, clear it
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            const { token: newToken } = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Get user data
            const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${newToken}`
                }
            });

            setUser(userResponse.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    // Signup function
    const signup = async (name, email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                name,
                email,
                password
            });

            const { token: newToken } = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);

            // Get user data
            const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${newToken}`
                }
            });

            setUser(userResponse.data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Signup failed'
            };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            // Call logout endpoint to clear server-side session
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage and state regardless of server response
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    // Get user data
    const getUser = () => {
        return user;
    };

    // Get token
    const getToken = () => {
        return token;
    };

    // Update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated,
        getUser,
        getToken,
        updateUser,
        _id: user?._id // Add user ID for easy access
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 