import axios from 'axios';
import authHeader from './auth-header';

// Set base URL from environment variable or default to localhost
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Add request interceptor to include auth header for all non-auth requests
axios.interceptors.request.use(
  (config) => {
    // Skip auth header for auth endpoints
    const url = config.url || '';
    if (!url.includes('/api/auth/')) {
      const authHeaders = authHeader();
      if (authHeaders.Authorization && !config.headers.Authorization) {
        config.headers.Authorization = authHeaders.Authorization;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;