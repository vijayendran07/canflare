import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Reusable Axios Client Instance
 * Configured with baseURL, default headers, and token interceptors
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize payload & error transformation
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const formattedError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected network error occurred',
      statusCode: error.response?.status || 500,
      data: error.response?.data || null,
    };
    return Promise.reject(formattedError);
  }
);

export default apiClient;

