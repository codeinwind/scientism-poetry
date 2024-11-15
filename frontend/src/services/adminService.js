import apiClient from './apiClient';
import ApiError from './ApiError';

const adminService = {
  // Get admin dashboard statistics
  getStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to access admin statistics', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to fetch admin statistics',
        error,
        false
      );
    }
  },

  // Get all users (admin only)
  getUsers: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/admin/users', {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to access user data', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to fetch users',
        error,
        false
      );
    }
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to update user roles', error, false);
      }
      if (error.response?.status === 404) {
        throw new ApiError('User not found', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to update user role',
        error,
        false
      );
    }
  },

  // Get poems for moderation
  getPoemsForModeration: async (status = 'under_review', page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/admin/poems', {
        params: { status, page, limit }
      });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to access poems', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to fetch poems',
        error,
        false
      );
    }
  },

  // Update poem status
  updatePoemStatus: async (poemId, status) => {
    try {
      const response = await apiClient.put(`/admin/poems/${poemId}/status`, { status });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to update poem status', error, false);
      }
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to update poem status',
        error,
        false
      );
    }
  },

  // Add review comment
  addReviewComment: async (poemId, content) => {
    try {
      const response = await apiClient.post(`/admin/poems/${poemId}/comments`, { content });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to add review comments', error, false);
      }
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to add review comment',
        error,
        false
      );
    }
  },

  // Get poem review history
  getPoemReviewHistory: async (poemId) => {
    try {
      const response = await apiClient.get(`/admin/poems/${poemId}/history`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to view review history', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to fetch review history',
        error,
        false
      );
    }
  }
};

export default adminService;
