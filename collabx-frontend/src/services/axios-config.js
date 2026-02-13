import axios from 'axios';
import authHeader from './auth-header';

// Add request interceptor to include auth header for all non-auth requests
axios.interceptors.request.use(
  (config) => {
    // Skip auth header for auth endpoints
    if (!config.url.includes('/api/auth/')) {
      const authHeaders = authHeader();
      if (authHeaders.Authorization) {
        config.headers.Authorization = authHeaders.Authorization;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;