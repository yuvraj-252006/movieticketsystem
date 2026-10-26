import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('imovies_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('imovies_token') || null;
  });
  const [loading, setLoading] = useState(false);

  // Set default axios authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('imovies_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('imovies_token');
      localStorage.removeItem('imovies_user');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('imovies_user', JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      if (response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('imovies_user', JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('imovies_user');
    localStorage.removeItem('imovies_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
