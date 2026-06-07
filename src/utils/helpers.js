/**
 * Frontend Utility Functions
 * Reusable helper functions for common UI and logic tasks
 */

import { LANGUAGE, STORAGE_KEYS } from '../constants/uiConstants.js';

/**
 * Language & Localization
 */

/**
 * Gets current language from localStorage
 * @returns {string} - Current language code
 */
export function getCurrentLanguage() {
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || LANGUAGE.DEFAULT;
}

/**
 * Sets current language
 * @param {string} lang - Language code
 */
export function setCurrentLanguage(lang) {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

/**
 * Storage Utilities
 */

/**
 * Gets item from localStorage with error handling
 * @param {string} key - Storage key
 * @returns {any} - Stored value or null
 */
export function getStorageItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading storage key '${key}':`, error);
    return null;
  }
}

/**
 * Sets item in localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing storage key '${key}':`, error);
  }
}

/**
 * Clears item from localStorage
 * @param {string} key - Storage key
 */
export function clearStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing storage key '${key}':`, error);
  }
}

/**
 * Authentication Utilities
 */

/**
 * Checks if user is authenticated
 * @returns {boolean} - Is authenticated
 */
export function isAuthenticated() {
  return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
}

/**
 * Sets authentication state
 * @param {boolean} isLoggedIn - Authentication state
 */
export function setAuthenticationState(isLoggedIn) {
  if (isLoggedIn) {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  }
}

/**
 * Navigation Utilities
 */

/**
 * Redirects to page if not authenticated
 */
export function requireAuthentication() {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

/**
 * Redirects authenticated users away from login page
 */
export function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = '/index.html';
  }
}

/**
 * Data Conversion Utilities
 */

/**
 * Converts value to hectares based on unit
 * @param {number} value - Area value
 * @param {string} unit - Area unit
 * @returns {number} - Value in hectares
 */
export function convertToHectares(value, unit) {
  const conversions = {
    'Bigha': 0.25,
    'Acre': 0.4047,
    'Hectare': 1
  };
  return value * (conversions[unit] || 1);
}

/**
 * Formats number with locale-specific formatting
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted number
 */
export function formatNumber(num, decimals = 2) {
  return parseFloat(num).toFixed(decimals);
}

/**
 * DOM Utilities
 */

/**
 * Safely gets element by ID
 * @param {string} id - Element ID
 * @returns {Element|null} - Element or null
 */
export function getElement(id) {
  return document.getElementById(id);
}

/**
 * Shows element
 * @param {string|Element} element - Element ID or element
 */
export function showElement(element) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) el.style.display = '';
}

/**
 * Hides element
 * @param {string|Element} element - Element ID or element
 */
export function hideElement(element) {
  const el = typeof element === 'string' ? getElement(element) : element;
  if (el) el.style.display = 'none';
}

/**
 * Disables button and shows loading state
 * @param {string|Element} element - Button element ID or element
 * @param {string} loadingText - Text to show while loading
 * @returns {string} - Original button text
 */
export function setButtonLoading(element, loadingText = 'Loading...') {
  const btn = typeof element === 'string' ? getElement(element) : element;
  if (!btn) return '';
  
  const originalText = btn.textContent;
  btn.textContent = loadingText;
  btn.disabled = true;
  btn.style.opacity = '0.7';
  
  return originalText;
}

/**
 * Restores button to normal state
 * @param {string|Element} element - Button element ID or element
 * @param {string} text - Text to restore
 */
export function restoreButton(element, text = '') {
  const btn = typeof element === 'string' ? getElement(element) : element;
  if (!btn) return;
  
  btn.textContent = text;
  btn.disabled = false;
  btn.style.opacity = '1';
}

/**
 * Error Handling Utilities
 */

/**
 * Logs error with context
 * @param {string} context - Where error occurred
 * @param {Error} error - Error object
 */
export function logError(context, error) {
  console.error(`[${context}]`, error);
}

/**
 * Gets user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
  if (error instanceof TypeError) {
    return 'Network error. Please check your connection.';
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Debounce Helper
 */

/**
 * Creates a debounced version of function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} - Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId = null;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export default {
  getCurrentLanguage,
  setCurrentLanguage,
  getStorageItem,
  setStorageItem,
  clearStorageItem,
  isAuthenticated,
  setAuthenticationState,
  requireAuthentication,
  redirectIfAuthenticated,
  convertToHectares,
  formatNumber,
  getElement,
  showElement,
  hideElement,
  setButtonLoading,
  restoreButton,
  logError,
  getErrorMessage,
  debounce
};
