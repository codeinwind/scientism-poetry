import apiClient from './apiClient';
import ApiError from './ApiError';

const handleApiError = (error, defaultMessage) => {
  if (error.response?.status === 404) {
    throw new ApiError(defaultMessage || 'Resource not found', error, false);
  }
  throw new ApiError(error.message || defaultMessage || 'API Error', error, false);
};

const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new ApiError(
          error.response.data.message || 'Login failed',
          error,
          false
        );
      }
      throw new ApiError(
        error.message || 'Login failed',
        error,
        false
      );
    }
  },

  resendVerification: async (data) => {
    try {
      const response = await apiClient.post('/auth/verification/resend', data);
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Failed to resend verification email',
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
      const response = await apiClient.post('/auth/login/logout');
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

  getActivityStats: async () => {
    try {
      const response = await apiClient.get('/auth/stats/activity');
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Failed to fetch activity stats',
        error,
        false
      );
    }
  },

  // Update author bio
  updateAuthorBio: async (authorId, bio) => {
    try {
      const response = await apiClient.put(`/auth/stats/${authorId}/bio/modify`, { bio });
      return {
        author: response.data.author,
      };
    } catch (error) {
      handleApiError(error, 'Failed to update author bio');
    }
  },

  // Update author penName
  updatePenName: async (authorId, penName) => {
    try {
      const response = await apiClient.put(`/auth/stats/${authorId}/penname/modify`, { penName });
      return {
        author: response.data.author,
      };
    } catch (error) {
      handleApiError(error, 'Failed to update author penName');
    }
  },

  // Change Password API Call
  changePassword: async ({ userId, currentPassword, newPassword }) => {
    try {
      const response = await apiClient.put(`/auth/stats/change-password`, {
        userId,
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        message: 'Password updated successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to update password',
      };
    }
  },

  // Submit/update author applications
  submitAuthorApplication: async ({ userId, statement }) => {
    try {
      const response = await apiClient.post('/auth/stats/hot-user/application', {
        userId,   
        statement: statement.trim()
      });

      return {
        success: true,
        application: response.data.data,
        message: response.data.message
      };

    } catch (error) {
      let errorData = {
        success: false,
        type: 'SUBMIT_ERROR',
        message: 'Application submission failed'
      };
      return errorData;
    }
  },

  getAuthorApplication: async (authorId) => {
    try {
      const response = await apiClient.get(
        `/auth/stats/${authorId}/author-applications/status`
      );
  
      return {
        success: true,
        application: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Unable to obtain the application information, please try again later'
      };
    }
  },
};

export default authService;
