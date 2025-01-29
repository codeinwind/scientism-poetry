import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing auth state...'); // Debug log
        const token = sessionStorage.getItem('token');
        const userData = sessionStorage.getItem('user');
        
        console.log('Stored token:', !!token); // Debug log
        console.log('Stored user data:', userData ? JSON.parse(userData) : null); // Debug log
        
        if (token && userData) {
          setAccessToken(token);
          setUser(JSON.parse(userData));
          
          // Verify token is still valid and get fresh user data
          const profile = await authService.getProfile();
          if (profile.success) {
            updateUser(profile.user);
            console.log('Profile verification successful:', profile.user); // Debug log
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error); // Debug log
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
        console.log('Attempting token refresh...'); // Debug log
        const response = await authService.refreshToken();
        setAccessToken(response.token);
        sessionStorage.setItem('token', response.token);
        console.log('Token refresh successful'); // Debug log
      } catch (error) {
        console.error('Token refresh error:', error); // Debug log
        // If refresh fails, log user out
        logout();
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  const login = async (userData, token) => {
    console.log('Logging in user:', {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role, // Add role to debug log
      createdAt: userData.createdAt,
      bio: userData.bio
    }); // Enhanced debug log
    setUser(userData);
    setAccessToken(token);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      console.log('Logging out user...'); // Debug log
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      console.log('User logged out successfully'); // Debug log
    }
  };

  const updateUser = (userData) => {
    console.log('Updating user data:', {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role, // Add role to debug log
      createdAt: userData.createdAt,
      bio: userData.bio
    }); // Enhanced debug log
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  // Debug log current auth state
  useEffect(() => {
    console.log('Auth state updated:', {
      isAuthenticated: !!user,
      user: user ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Add role to debug log
        createdAt: user.createdAt,
        bio: user.bio
      } : null,
      hasToken: !!accessToken
    });
  }, [user, accessToken]);

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
