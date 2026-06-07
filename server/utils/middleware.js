/**
 * CORS Middleware
 * Handles cross-origin requests
 */

import { CONFIG } from '../config/constants.js';

/**
 * CORS middleware setup
 * Allows cross-origin requests with proper headers
 */
export function corsMiddleware(req, res, next) {
  res.header('Access-Control-Allow-Origin', CONFIG.SERVER.CORS_ORIGIN);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
}

/**
 * Request logging middleware
 * Logs all incoming requests
 */
export function requestLogger(req, res, next) {
  const startTime = Date.now();
  const contentLength = req.headers['content-length'];

  // Log request size if available
  if (contentLength) {
    const kb = (parseInt(contentLength, 10) / 1024).toFixed(2);
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Request size: ${kb} KB`);
  } else {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }

  // Hook into response to log completion
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    return originalSend.call(this, data);
  };

  next();
}

export default { corsMiddleware, requestLogger };
