import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Use sessionStorage instead of localStorage
        const userData = sessionStorage.getItem('user');
        
        if (token && userData) {
          setAccessToken(token);
          setUser(JSON.parse(userData));
          
          // Verify token is still valid
          await authService.getProfile();
        }
      } catch (error) {
        // If token is invalid, clear auth state
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Setup token refresh interval
  useEffect(() => {
    if (!accessToken) return;

    const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
    const refreshInterval = setInterval(async () => {
      try {
        const response = await authService.refreshToken();
        setAccessToken(response.token);
        sessionStorage.setItem('token', response.token);
      } catch (error) {
        // If refresh fails, log user out
        logout();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  const login = async (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        accessToken,
        login,
        logout,
        updateUser,
      }}
    >
      {!loading && children}
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
