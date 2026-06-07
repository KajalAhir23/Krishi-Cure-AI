/**
 * Rate Limiter Middleware
 * Protects API from abuse by limiting requests per IP
 */

import rateLimit from 'express-rate-limit';
import { CONFIG } from '../config/constants.js';

/**
 * Creates rate limiter middleware
 * Limits each IP to specified number of requests per time window
 */
const limiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT.WINDOW_MS,
  max: CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_WINDOW,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: CONFIG.RATE_LIMIT.MESSAGE,
  skip: (req) => {
    // Don't rate limit static file requests
    if (req.method === 'GET' && !req.url.startsWith('/api')) {
      return true;
    }
    return false;
  }
});

export default limiter;
