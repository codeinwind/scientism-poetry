import apiClient from './apiClient';
import ApiError from './ApiError';

const handleApiError = (error, defaultMessage) => {
  if (error.response?.status === 404) {
    throw new ApiError(defaultMessage || 'Resource not found', error, false);
  }
  throw new ApiError(error.message || defaultMessage || 'API Error', error, false);
};

const poemService = {
  // Get the most published authors
  getTopAuthors: async () => {
    try {
      const response = await apiClient.get('/poems/authors/top');
      return response.data; // Return to author list
    } catch (error) {
      throw new ApiError(
        error.message || 'Failed to fetch top authors',
        error,
        false
      );
    }
  },

  // Get poems by designated authors
  getAuthorPoems: async (authorId) => {
    try {
      const response = await apiClient.get(`/poems/${authorId}/author`);
      return {
        author: response.data.author,
        poems: response.data.poems,
      };
    } catch (error) {
      throw new ApiError(
        error.message || 'Failed to fetch author poems',
        error,
        false
      );
    }
  },

  // Update author bio
  updateAuthorBio: async (authorId, bio) => {
    try {
      const response = await apiClient.put(`/poems/authors/${authorId}/bio`, { bio });
      return {
        success: true,
        data: response.data,
        message: 'Author bio updated successfully',
      };
    } catch (error) {
      handleApiError(error, 'Failed to update author bio');
    }
  },

  // Get all authors
  getAllAuthors: async () => {
    try {
      const response = await apiClient.get('/poems/authors');
      return response.data;
    } catch (error) {
      throw new ApiError(
        error.message || 'Failed to fetch all authors',
        error,
        false
      );
    }
  },

  getAllPoems: async (page = 1, limit = 10, search = '', language) => {
    try {
      const response = await apiClient.get('/poems', {
        params: { page, limit, search, lang:language },
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
      const response = await apiClient.get(`/poems/user/${userId}`);
      // Get poems directly from response.data.poems
      const poems = response.data.poems || [];

      return {
        success: true,
        poems: poems,
        count: poems.length,
      };
    } catch (error) {
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
      const response = await apiClient.post('/poems', poemData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw new ApiError(
        error.message || 'Failed to create poem',
        error,
        false
      );
    }
  },

  updatePoem: async (id, poemData) => {
    try {
      const response = await apiClient.put(`/poems/${id}`, poemData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
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
      const response = await apiClient.delete(`/poems/${id}`);
      return {
        success: true,
        message: response.data.message || 'Poem deleted successfully',
      };
    } catch (error) {
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
