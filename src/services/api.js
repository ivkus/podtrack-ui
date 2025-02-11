import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints for articles
export const articlesApi = {
  /**
   * Get all articles
   * @returns {Promise<Array>} Array of articles
   */
  getAll: () => api.get('/articles/'),

  /**
   * Get a single article by ID
   * @param {string|number} id Article ID
   * @returns {Promise<Object>} Article data
   */
  get: (id) => api.get(`/articles/${id}/`),

  /**
   * Create a new article
   * @param {Object} data Article data
   * @param {string} data.title Article title
   * @param {string} data.content Article content
   * @returns {Promise<Object>} Created article
   */
  create: (data) => api.post('/articles/', data),

  /**
   * Analyze an article
   * @param {string|number} id Article ID
   * @returns {Promise<Object>} Analysis results
   */
  analyze: (id) => api.post(`/articles/${id}/analyze/`),

  /**
   * Delete an article
   * @param {string|number} id Article ID
   * @returns {Promise}
   */
  delete: (id) => api.delete(`/articles/${id}/`),
};

// API endpoints for vocabulary
export const vocabularyApi = {
  /**
   * Get all vocabulary items
   * @returns {Promise<Array>} Array of vocabulary items
   */
  getAll: () => api.get('/vocabulary/'),

  /**
   * Update a vocabulary item
   * @param {string|number} id Vocabulary item ID
   * @param {Object} data Update data
   * @returns {Promise<Object>} Updated vocabulary item
   */
  update: (id, data) => api.patch(`/vocabulary/${id}/`, data),

  /**
   * Toggle mastered status
   * @param {string|number} id Vocabulary item ID
   * @returns {Promise<Object>} Updated vocabulary item
   */
  toggleMastered: (id) => api.post(`/vocabulary/${id}/toggle_mastered/`),

  /**
   * Toggle ignored status
   * @param {string|number} id Vocabulary item ID
   * @returns {Promise<Object>} Updated vocabulary item
   */
  toggleIgnored: (id) => api.post(`/vocabulary/${id}/toggle_ignored/`),

  /**
   * Get vocabulary stats
   * @returns {Promise<Object>} Vocabulary statistics
   */
  getStats: () => api.get('/vocabulary/stats/'),
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Server error');
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // Handle network errors
      console.error('Network error');
    }
    return Promise.reject(error);
  }
);

export default api;