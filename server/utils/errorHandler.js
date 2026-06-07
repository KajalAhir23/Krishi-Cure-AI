/**
 * Error Handling & Response Utilities
 * Provides standardized error responses and HTTP utilities
 */

import { CONFIG } from '../config/constants.js';

/**
 * Standard API error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Error response object
 */
export function createErrorResponse(message, statusCode = 500) {
  return {
    success: false,
    statusCode,
    error: message,
    timestamp: new Date().toISOString()
  };
}

/**
 * Standard API success response
 * @param {any} data - Response data
 * @param {string} message - Optional success message
 * @returns {Object} - Success response object
 */
export function createSuccessResponse(data, message = null) {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}

/**
 * Express middleware to send standardized error responses
 * @param {Error} error - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next
 */
export function globalErrorHandler(error, req, res, next) {
  console.error('[Global Error Handler] Unhandled exception:', error);

  let statusCode = 500;
  let message = CONFIG.ERRORS.SERVER_ERROR;

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  } else if (error.message) {
    message = error.message;
  }

  res.status(statusCode).json(createErrorResponse(message, statusCode));
}

/**
 * Express middleware for handling 404 routes
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
export function notFoundHandler(req, res) {
  res.status(404).json(createErrorResponse('Endpoint not found', 404));
}

/**
 * Creates a timeout promise for fetch operations
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} - Fetch promise with timeout
 */
export function fetchWithTimeout(url, options = {}, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  return fetch(url, { ...options, signal: controller.signal })
    .catch(error => {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${ms}ms`);
      }
      throw error;
    })
    .finally(() => clearTimeout(timer));
}

/**
 * Logs API request with details
 * @param {Object} req - Express request
 */
export function logRequest(req) {
  const contentLength = req.headers['content-length'];
  if (contentLength) {
    const kb = (parseInt(contentLength, 10) / 1024).toFixed(2);
    console.log(`[Request] ${req.method} ${req.url} - Size: ${kb} KB`);
  } else {
    console.log(`[Request] ${req.method} ${req.url}`);
  }
}

/**
 * Logs API response with details
 * @param {Object} req - Express request
 * @param {number} statusCode - HTTP status code
 * @param {number} duration - Request duration in ms
 */
export function logResponse(req, statusCode, duration) {
  console.log(`[Response] ${req.method} ${req.url} - Status: ${statusCode} - Duration: ${duration}ms`);
}
