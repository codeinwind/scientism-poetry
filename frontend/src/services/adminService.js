import apiClient from './apiClient';
import ApiError from './ApiError';

// Status transition validation
const VALID_STATUS_TRANSITIONS = {
  draft: ['under_review'],
  under_review: ['published', 'draft'],
  published: ['under_review']
};

const adminService = {
  // Get all poems with status filter
  getAllPoems: async (page = 1, limit = 10, status = null) => {
    try {
      const params = { page, limit };
      if (status) {
        params.status = status;
      }

      const response = await apiClient.get('/admin/poems', { params });
      
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          limit,
          total: 0,
          pages: 0,
        },
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to access admin features', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to fetch poems',
        error,
        false
      );
    }
  },

  // Update poem status with validation
  updatePoemStatus: async (id, newStatus, currentStatus) => {
    try {
      // Validate status transition
      const validTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
      if (!validTransitions || !validTransitions.includes(newStatus)) {
        throw new ApiError(
          `Invalid status transition from ${currentStatus} to ${newStatus}`,
          null,
          false
        );
      }

      const response = await apiClient.put(`/poems/${id}/status`, { 
        status: newStatus,
        previousStatus: currentStatus // For server-side validation
      });

      return {
        success: true,
        data: response.data.data,
        message: `Status successfully changed to ${newStatus}`
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to change poem status', error, false);
      }
      if (error.response?.status === 400) {
        throw new ApiError(
          error.response.data.message || 'Invalid status transition',
          error,
          false
        );
      }
      throw new ApiError(
        error.message || 'Failed to update poem status',
        error,
        false
      );
    }
  },

  // Get poem review statistics
  getPoemStats: async () => {
    try {
      const response = await apiClient.get('/admin/poems/stats');
      return {
        success: true,
        data: {
          ...response.data.data,
          statusCounts: {
            draft: response.data.data.draftCount || 0,
            under_review: response.data.data.underReviewCount || 0,
            published: response.data.data.publishedCount || 0
          }
        }
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to access admin features', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to fetch poem statistics',
        error,
        false
      );
    }
  },

  // Batch update poem statuses
  batchUpdateStatus: async (poemIds, newStatus, currentStatus) => {
    try {
      // Validate status transition
      const validTransitions = VALID_STATUS_TRANSITIONS[currentStatus];
      if (!validTransitions || !validTransitions.includes(newStatus)) {
        throw new ApiError(
          `Invalid status transition from ${currentStatus} to ${newStatus}`,
          null,
          false
        );
      }

      const response = await apiClient.put('/admin/poems/batch-status', {
        poemIds,
        status: newStatus,
        previousStatus: currentStatus
      });

      return {
        success: true,
        data: response.data.data,
        message: `Status successfully updated for ${poemIds.length} poems`
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to update poem statuses', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to update poem statuses',
        error,
        false
      );
    }
  },

  // Get review history for a poem
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
  },

  // Add review comment
  addReviewComment: async (poemId, comment) => {
    try {
      const response = await apiClient.post(`/admin/poems/${poemId}/review-comment`, {
        content: comment
      });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      if (error.response?.status === 403) {
        throw new ApiError('Not authorized to add review comments', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to add review comment',
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
};

export default adminService;
