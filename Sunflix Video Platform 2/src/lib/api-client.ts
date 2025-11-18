// MongoDB Client Utility - Browser/Frontend Client
// Makes API calls to backend instead of direct DB access

import axios from 'axios';

// Default to same-origin when `VITE_API_URL` is not set in the build environment.
// This prevents the frontend from calling `http://localhost:3001` when deployed
// on Vercel. If you want the frontend to call an external API, set
// `VITE_API_URL` in Vercel's Environment Variables (for Production/Preview).
const API_URL = import.meta.env.VITE_API_URL ?? '';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sunflix-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  // Return the full axios response so callers can access response.data
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sunflix-token');
      localStorage.removeItem('sunflix-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
