import axios from 'axios';

// Function to determine the appropriate API URL with protocol check
const getApiUrl = () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  // If it's a production environment or the URL is not localhost, enforce HTTPS
  if (!apiUrl.includes('localhost') && !apiUrl.startsWith('https://')) {
    return apiUrl.replace('http://', 'https://');
  }
  
  return apiUrl;
};

const API_URL = getApiUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const response = await api.post('/auth/refresh-token');
        const { token } = response.data;

        // Update token in storage and auth header
        sessionStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth state and redirect to login
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Transform error response to be more consistent
    if (error.response?.data) {
      // If the error has a message field, use it
      if (error.response.data.message) {
        error.message = error.response.data.message;
      }
      // Add success flag if not present
      if (typeof error.response.data.success === 'undefined') {
        error.response.data.success = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Poems Services
export const poemService = {
  getAllPoems: async (page = 1, limit = 10, search = '') => {
    try {
      const response = await api.get('/poems', {
        params: { page, limit, search },
      });
      
      // Ensure we have the expected data structure
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
      // Return consistent error structure
      throw {
        success: false,
        message: error.message || 'Failed to fetch poems',
        error,
      };
    }
  },

  getUserPoems: async (userId) => {
    try {
      const response = await api.get(`/poems/user/${userId}`);
      
      // Handle the updated response structure from backend
      return {
        success: true,
        poems: response.data.poems || [],
        count: response.data.count || 0,
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
      throw {
        success: false,
        message: error.message || 'Failed to fetch user poems',
        error,
      };
    }
  },

  getPoemById: async (id) => {
    try {
      const response = await api.get(`/poems/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      // If it's a 404, we want to handle it specially
      if (error.response?.status === 404) {
        throw {
          success: false,
          message: 'Poem not found',
          error,
        };
      }
      throw {
        success: false,
        message: error.message || 'Failed to fetch poem',
        error,
      };
    }
  },

  createPoem: async (poemData) => {
    try {
      const response = await api.post('/poems', poemData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to create poem',
        error,
      };
    }
  },

  updatePoem: async (id, poemData) => {
    try {
      const response = await api.put(`/poems/${id}`, poemData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      // Handle 404 specially
      if (error.response?.status === 404) {
        throw {
          success: false,
          message: 'Poem not found',
          error,
        };
      }
      throw {
        success: false,
        message: error.message || 'Failed to update poem',
        error,
      };
    }
  },

  deletePoem: async (id) => {
    try {
      const response = await api.delete(`/poems/${id}`);
      return {
        success: true,
        message: response.data.message || 'Poem deleted successfully',
      };
    } catch (error) {
      // Handle 404 specially
      if (error.response?.status === 404) {
        throw {
          success: false,
          message: 'Poem not found',
          error,
        };
      }
      throw {
        success: false,
        message: error.message || 'Failed to delete poem',
        error,
      };
    }
  },

  likePoem: async (id) => {
    try {
      const response = await api.post(`/poems/${id}/like`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      // Handle 404 specially
      if (error.response?.status === 404) {
        throw {
          success: false,
          message: 'Poem not found',
          error,
        };
      }
      throw {
        success: false,
        message: error.message || 'Failed to like poem',
        error,
      };
    }
  },

  addComment: async (id, comment) => {
    try {
      const response = await api.post(`/poems/${id}/comments`, { content: comment });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      // Handle 404 specially
      if (error.response?.status === 404) {
        throw {
          success: false,
          message: 'Poem not found',
          error,
        };
      }
      throw {
        success: false,
        message: error.message || 'Failed to add comment',
        error,
      };
    }
  },
};

export default api;
