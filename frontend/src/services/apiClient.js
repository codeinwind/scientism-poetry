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
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  console.log('Request URL:', config.url); // Debug log
  console.log('Token present:', !!token); // Debug log
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request headers:', config.headers); // Debug log
  return config;
});

// Handle response errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response data:', response.data); // Debug log
    return response;
  },
  async (error) => {
    console.error('Response error:', error.response?.status, error.response?.data); // Debug log
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Attempting token refresh...'); // Debug log

      try {
        // Attempt to refresh token
        const response = await apiClient.post('/auth/refresh-token');
        const { token } = response.data;
        console.log('Token refreshed successfully'); // Debug log

        // Update token in storage and auth header
        sessionStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError); // Debug log
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

export default apiClient;
