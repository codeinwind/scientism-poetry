import apiClient from './apiClient';
import ApiError from './ApiError';

const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Login failed',
        error,
        false
      );
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Registration failed',
        error,
        false
      );
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Logout failed',
        error,
        false
      );
    }
  },

  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Token refresh failed',
        error,
        false
      );
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Profile update failed',
        error,
        false
      );
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Failed to fetch profile',
        error,
        false
      );
    }
  },
};

export default authService;
