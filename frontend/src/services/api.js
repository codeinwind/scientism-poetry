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
    const response = await api.get('/poems', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getUserPoems: async (userId) => {
    const response = await api.get(`/poems/user/${userId}`);
    return response.data;
  },

  getPoemById: async (id) => {
    const response = await api.get(`/poems/${id}`);
    return response.data;
  },

  createPoem: async (poemData) => {
    const response = await api.post('/poems', poemData);
    return response.data;
  },

  updatePoem: async (id, poemData) => {
    const response = await api.put(`/poems/${id}`, poemData);
    return response.data;
  },

  deletePoem: async (id) => {
    const response = await api.delete(`/poems/${id}`);
    return response.data;
  },

  likePoem: async (id) => {
    const response = await api.post(`/poems/${id}/like`);
    return response.data;
  },

  addComment: async (id, comment) => {
    const response = await api.post(`/poems/${id}/comments`, { content: comment });
    return response.data;
  },
};

export default api;
