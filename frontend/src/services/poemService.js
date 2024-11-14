import apiClient from './apiClient';
import ApiError from './ApiError';

const poemService = {
  getAllPoems: async (page = 1, limit = 10, search = '') => {
    try {
      const response = await apiClient.get('/poems', {
        params: { page, limit, search },
      });
      
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
      throw new ApiError(
        error.message || 'Failed to fetch poems',
        error,
        false
      );
    }
  },

  getUserPoems: async (userId) => {
    try {
      console.log('Fetching poems for user:', userId); // Debug log
      const response = await apiClient.get(`/poems/user/${userId}`);
      console.log('User poems API response:', response.data); // Debug log
      
      // Get poems directly from response.data.poems
      const poems = response.data.poems || [];
      console.log('Extracted poems:', poems); // Debug log
      
      return {
        success: true,
        poems: poems,
        count: poems.length,
      };
    } catch (error) {
      console.error('Error in getUserPoems:', error); // Debug log
      // If it's a 404, return empty data instead of throwing
      if (error.response?.status === 404) {
        return {
          success: true,
          poems: [],
          count: 0,
        };
      }
      throw new ApiError(
        error.message || 'Failed to fetch user poems',
        error,
        false
      );
    }
  },

  getPoemById: async (id) => {
    try {
      const response = await apiClient.get(`/poems/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to fetch poem',
        error,
        false
      );
    }
  },

  createPoem: async (poemData) => {
    try {
      console.log('Creating poem with data:', poemData); // Debug log
      const response = await apiClient.post('/poems', poemData);
      console.log('Create poem response:', response.data); // Debug log
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error creating poem:', error); // Debug log
      throw new ApiError(
        error.message || 'Failed to create poem',
        error,
        false
      );
    }
  },

  updatePoem: async (id, poemData) => {
    try {
      console.log('Updating poem:', id, 'with data:', poemData); // Debug log
      const response = await apiClient.put(`/poems/${id}`, poemData);
      console.log('Update poem response:', response.data); // Debug log
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error updating poem:', error); // Debug log
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to update poem',
        error,
        false
      );
    }
  },

  deletePoem: async (id) => {
    try {
      console.log('Deleting poem:', id); // Debug log
      const response = await apiClient.delete(`/poems/${id}`);
      console.log('Delete poem response:', response.data); // Debug log
      return {
        success: true,
        message: response.data.message || 'Poem deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting poem:', error); // Debug log
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to delete poem',
        error,
        false
      );
    }
  },

  likePoem: async (id) => {
    try {
      const response = await apiClient.post(`/poems/${id}/like`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to like poem',
        error,
        false
      );
    }
  },

  addComment: async (id, comment) => {
    try {
      const response = await apiClient.post(`/poems/${id}/comments`, { content: comment });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new ApiError('Poem not found', error, false);
      }
      throw new ApiError(
        error.message || 'Failed to add comment',
        error,
        false
      );
    }
  },
};

export default poemService;
