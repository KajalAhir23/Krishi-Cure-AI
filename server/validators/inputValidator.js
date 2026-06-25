/**
 * Input Validation Utilities
 * Validates user input across the application
 */

import { CONFIG } from '../config/constants.js';

/**
 * Validates diagnosis request parameters
 * @param {Object} data - Request body data
 * @returns {Object} - {isValid: boolean, error?: string}
 */
export function validateDiagnosisInput(data) {
  const { cropId, symptoms } = data;

  if (!cropId || typeof cropId !== 'string') {
    return { isValid: false, error: CONFIG.ERRORS.MISSING_CROP_ID };
  }

  if (!symptoms || (Array.isArray(symptoms) && symptoms.length === 0)) {
    return { isValid: false, error: CONFIG.ERRORS.MISSING_SYMPTOMS };
  }

  if (Array.isArray(symptoms)) {
    if (!symptoms.every(s => typeof s === 'string')) {
      return { isValid: false, error: CONFIG.ERRORS.MISSING_SYMPTOMS };
    }
  } else if (typeof symptoms !== 'string') {
    return { isValid: false, error: CONFIG.ERRORS.MISSING_SYMPTOMS };
  }

  return { isValid: true };
}

/**
 * Validates image diagnosis request parameters
 * @param {Object} data - Request body data
 * @returns {Object} - {isValid: boolean, error?: string}
 */
export function validateImageDiagnosisInput(data) {
  const { cropId, images } = data;

  if (!cropId || typeof cropId !== 'string') {
    return { isValid: false, error: CONFIG.ERRORS.MISSING_CROP_ID };
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    return { isValid: false, error: CONFIG.ERRORS.MISSING_IMAGES };
  }

  if (images.some(img => !img || typeof img !== 'object' || typeof img.base64Data !== 'string')) {
    return { isValid: false, error: CONFIG.ERRORS.MISSING_IMAGES };
  }

  return { isValid: true };
}

/**
 * Validates chatbot question input
 * @param {Object} data - Request body data
 * @returns {Object} - {isValid: boolean, error?: string}
 */
export function validateChatbotInput(data) {
  const { question } = data;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return { isValid: false, error: CONFIG.ERRORS.MISSING_QUESTION };
  }

  return { isValid: true };
}

/**
 * Validates fertilizer calculation request parameters
 * @param {Object} data - Request body data
 * @returns {Object} - {isValid: boolean, error?: string}
 */
export function validateFertilizerInput(data) {
  const { cropId, fertilizerId, areaUnit, areaValue } = data;

  if (!cropId || typeof cropId !== 'string') {
    return { isValid: false, error: CONFIG.ERRORS.MISSING_CROP_ID };
  }

  if (!fertilizerId || typeof fertilizerId !== 'string') {
    return { isValid: false, error: 'Missing or invalid fertilizerId' };
  }

  if (!areaUnit || !CONFIG.FERTILIZER.AREA_UNITS.includes(areaUnit)) {
    return { isValid: false, error: 'Invalid areaUnit' };
  }

  const numValue = parseFloat(areaValue);
  if (isNaN(numValue) || numValue <= 0) {
    return { isValid: false, error: CONFIG.ERRORS.INVALID_AREA_VALUE };
  }

  return { isValid: true };
}

/**
 * Validates language parameter
 * @param {string} lang - Language code
 * @returns {string} - Valid language code or default
 */
export function validateLanguage(lang) {
  const validLangs = Object.values(CONFIG.LANGUAGES).filter(v => typeof v === 'string' && v !== 'DEFAULT');
  return validLangs.includes(lang) ? lang : CONFIG.LANGUAGES.DEFAULT;
}

/**
 * Sanitizes string input to prevent injection attacks
 * @param {string} input - Input string
 * @returns {string} - Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 5000); // Limit length
}
