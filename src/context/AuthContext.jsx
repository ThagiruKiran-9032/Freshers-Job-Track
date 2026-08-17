import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentSession,
  loginUser,
  registerUser,
  clearCurrentSession,
  updateUserProfileCompleted
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize active session on mount
  useEffect(() => {
    try {
      const session = getCurrentSession();
      if (session) {
        setCurrentUser(session);
      }
    } catch (err) {
      console.error('Error initializing auth session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const session = await loginUser({ email, password });
      setCurrentUser(session);
      return session;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const session = await registerUser(data);
      setCurrentUser(session);
      return session;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearCurrentSession();
    setCurrentUser(null);
  };

  const completeOnboarding = () => {
    if (currentUser?.id) {
      updateUserProfileCompleted(currentUser.id);
      setCurrentUser(prev => prev ? { ...prev, profileCompleted: true } : null);
    }
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loading,
    login,
    register,
    logout,
    completeOnboarding
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
