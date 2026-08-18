import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const REGISTERED_USERS_KEY = 'jobtrack_registered_users';
const AUTH_SESSION_KEY = 'jobtrack_auth_session';

/**
 * Simple password hash simulator for frontend demo.
 * Clearly demarcated as demo security since this is a frontend-only React application.
 */
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'demo_hash_' + Math.abs(hash).toString(36);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from localStorage on initial load
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (storedSession) {
        const parsedUser = JSON.parse(storedSession);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      console.error('Error restoring authentication state from localStorage:', err);
      localStorage.removeItem(AUTH_SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to read all registered users
  const getRegisteredUsers = () => {
    try {
      const usersJson = localStorage.getItem(REGISTERED_USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (err) {
      return [];
    }
  };

  /**
   * Register a new user
   */
  const register = async ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));

    // Session user object (excluding password hash)
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    setIsAuthenticated(true);

    return { success: true, user: sessionUser };
  };

  /**
   * Login an existing user
   */
  const login = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const users = getRegisteredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }

    if (foundUser.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Incorrect password. Please check your credentials.' };
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    setIsAuthenticated(true);

    return { success: true, user: sessionUser };
  };

  /**
   * Logout current user
   */
  const logout = () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
