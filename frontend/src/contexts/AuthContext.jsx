import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Found token, checking auth status...');
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Auth status response:', response.data);
        setUser(response.data);
      } else {
        console.log('No token found, user is not authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // If token verification fails, clear everything
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Set token in localStorage
      localStorage.setItem('token', token);
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      const { token, user: userData } = response.data;
      
      // Set token in localStorage
      localStorage.setItem('token', token);
      
      // Set token in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Register error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    
    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset user state
    setUser(null);
    
    // Force a hard redirect to login page
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
