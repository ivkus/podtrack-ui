/**
 * Local storage service for persisting data
 */
const STORAGE_PREFIX = 'english_learning_';

export const storage = {
  /**
   * Set an item in local storage
   * @param {string} key Storage key
   * @param {any} value Value to store
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Get an item from local storage
   * @param {string} key Storage key
   * @param {any} defaultValue Default value if key doesn't exist
   * @returns {any} Stored value or default value
   */
  get(key, defaultValue = null) {
    try {
      const serializedValue = localStorage.getItem(STORAGE_PREFIX + key);
      if (serializedValue === null) return defaultValue;
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove an item from local storage
   * @param {string} key Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all items with the storage prefix
   */
  clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};