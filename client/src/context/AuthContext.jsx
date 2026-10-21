import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admitwise_token'));
  const [loading, setLoading] = useState(true);

  // Load current user profile if token or cookie exists
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // Silently clear stale token if invalid
        localStorage.removeItem('admitwise_token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    if (data.success) {
      if (data.token) {
        localStorage.setItem('admitwise_token', data.token);
        setToken(data.token);
      }
      setUser(data.user);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register({ name, email, password });
    if (data.success) {
      if (data.token) {
        localStorage.setItem('admitwise_token', data.token);
        setToken(data.token);
      }
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore logout network error
    } finally {
      localStorage.removeItem('admitwise_token');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
