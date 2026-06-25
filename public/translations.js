// translations.js - Centralized translation helper
// This file should be loaded before any other script that needs translations.

// Ensure appData is already fetched; if not, t will fallback to key.
window.langStore = (window.appData && window.appData.langStore) || {};

/**
 * Translation helper
 * @param {string} key - translation key defined in langStore
 * @returns {string} - translated string for current language or key if missing
 */
window.t = function(key) {
  const store = window.langStore[window.currentLang];
  if (store && store[key]) {
    return store[key];
  }
  return key; // fallback to key identifier
};
