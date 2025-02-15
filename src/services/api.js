import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:30000/api';

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
   * Get all articles with pagination
   * @param {number} page Page number (starts from 1)
   * @returns {Promise<Object>} Paginated articles data
   */
  getAll: (page = 1) => api.get('/articles/', {
    params: {
      page
    }
  }),
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

  uploadArticle(formData) {
    return api.post('/articles/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// API endpoints for vocabulary
export const vocabularyApi = {
  /**
   * Get all vocabulary items with filtering and pagination
   * @param {URLSearchParams} params Query parameters for filtering and pagination
   * @param {number} [params.page] Page number (starts from 1)
   * @param {boolean} [params.mastered] Filter by mastered status
   * @param {boolean} [params.ignored] Filter by ignored status
   * @returns {Promise<Object>} Paginated vocabulary items
   */
  getAll: (params) => api.get(`/vocabulary/?${params.toString()}`),

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

  /**
   * Delete a vocabulary item
   * @param {string|number} id Vocabulary item ID
   * @returns {Promise}
   */
  delete: (id) => api.delete(`/vocabulary/${id}/`),

  /**
   * Bulk delete vocabulary items
   * @param {Array<string|number>} ids Array of vocabulary item IDs
   * @returns {Promise}
   */
  bulkDelete: (ids) => api.post('/vocabulary/bulk_delete/', { ids }),
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