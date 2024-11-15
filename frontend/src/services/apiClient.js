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
  console.log('Request interceptor:', {
    url: config.url,
    hasToken: !!token,
    headers: config.headers
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token added to request:', {
      url: config.url,
      authHeader: config.headers.Authorization
    });
  }
  return config;
});

// Handle response errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response interceptor:', {
      url: response.config.url,
      status: response.status,
      hasData: !!response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log('Response error interceptor:', {
      url: originalRequest.url,
      status: error.response?.status,
      message: error.message
    });

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401) {
      // Check if the error is from the login endpoint
      if (originalRequest.url.includes('/auth/login')) {
        console.error('Login failed, not attempting token refresh.');
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          console.log('Attempting token refresh...');
          const response = await apiClient.post('/auth/refresh-token');
          const { token } = response.data;

          // Update token in storage and auth header
          sessionStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;

          console.log('Token refresh successful, retrying original request');
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
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
