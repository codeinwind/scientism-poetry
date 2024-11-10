import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
