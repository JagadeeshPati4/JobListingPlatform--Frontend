// src/utils/helpers.js

/**
 * Format salary for display
 * @param {number} salary - The salary amount
 * @returns {string} Formatted salary with currency symbol
 */
export const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(salary);
  };
  
  /**
   * Calculate time elapsed since a date
   * @param {string} dateString - ISO date string
   * @returns {string} Human-readable time elapsed
   */
  export const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return 'Just now';
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} limit - Character limit
   * @returns {string} Truncated text
   */
  export const truncateText = (text, limit = 100) => {
    if (!text) return '';
    
    if (text.length <= limit) return text;
    
    return text.slice(0, limit) + '...';
  };
  
  /**
   * Get user's current role from localStorage
   * @returns {string} User role or empty string if not logged in
   */
  export const getUserRole = () => {
    const user = localStorage.getItem('user');
    if (!user) return '';
    
    try {
      const userData = JSON.parse(user);
      return userData.role || '';
    } catch (error) {
      return '';
    }
  };
  
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };
  
  /**
   * Get current user data from localStorage
   * @returns {Object|null} User data or null if not logged in
   */
  export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    try {
      return JSON.parse(user);
    } catch (error) {
      return null;
    }
  };
  
  /**
   * Create a debounced function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Get validation schema error message
   * @param {Object} error - Validation error
   * @param {string} field - Field name
   * @returns {string} Error message or empty string
   */
  export const getErrorMessage = (error, field) => {
    return error && error.errors && error.errors[field] ? error.errors[field].message : '';
  };
  
  /**
   * Get job type chip color
   * @param {string} jobType - Job type
   * @returns {string} Color for MUI Chip
   */
  export const getJobTypeColor = (jobType) => {
    const types = {
      'Full-Time': 'primary',
      'Part-Time': 'secondary',
      'Internship': 'success',
      'Contractual': 'warning',
      'Remote': 'info'
    };
    
    return types[jobType] || 'default';
  };