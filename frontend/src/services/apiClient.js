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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401) {
      // Check if the error is from the login endpoint
      if (originalRequest.url.includes('/auth/login')) {
        console.error('Login failed, not attempting token refresh.'); // Debug log
        return Promise.reject(error); // Reject the promise to stop further processing
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Attempt to refresh token
          const response = await apiClient.post('/auth/refresh-token');
          const { token } = response.data;

          // Update token in storage and auth header
          sessionStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear auth state and redirect to login
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
