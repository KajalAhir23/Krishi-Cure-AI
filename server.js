/**
 * Krishi Cure AI - Main Server Entry Point
 * Professional-grade Node.js/Express application
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import limiter from './server/middlewares/rateLimiter.js';
import { corsMiddleware, requestLogger } from './server/utils/middleware.js';
import { globalErrorHandler, notFoundHandler } from './server/utils/errorHandler.js';
import { validateEnvironment } from './server/config/environment.js';
import { CONFIG } from './server/config/constants.js';
import apiRoutes from './server/routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment configuration before starting
validateEnvironment();

const app = express();

/**
 * ========================================
 * Middleware Setup
 * ========================================
 */

// CORS & Security
app.use(corsMiddleware);

// Request logging
app.use(requestLogger);

// Rate limiting (protects against abuse)
app.use(limiter);

// Body parsing with size limits
app.use(express.urlencoded({
  limit: CONFIG.REQUEST.MAX_PAYLOAD_SIZE,
  extended: true
}));
app.use(express.json({
  limit: CONFIG.REQUEST.MAX_JSON_SIZE
}));

/**
 * ========================================
 * Static Files & Frontend
 * ========================================
 */

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

/**
 * ========================================
 * API Routes
 * ========================================
 */

app.use('/api', apiRoutes);

/**
 * ========================================
 * SPA Fallback & Error Handling
 * ========================================
 */

// Fallback to index.html for frontend routes (SPA)
app.get(/.*/, (req, res, next) => {
  // Only fallback if it's not an API request
  if (!req.url.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// 404 handler for API routes
app.use((req, res) => {
  notFoundHandler(req, res);
});

// Global error handler
app.use(globalErrorHandler);

/**
 * ========================================
 * Server Startup
 * ========================================
 */

const PORT = CONFIG.SERVER.PORT;

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║          🌾 Krishi Cure AI - Server Started 🌾         ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n  📍 Server running on: http://localhost:${PORT}`);
  console.log(`  🌍 Environment: ${CONFIG.SERVER.ENVIRONMENT}`);
  console.log(`  🔒 CORS Origin: ${CONFIG.SERVER.CORS_ORIGIN}`);
  console.log('\n✅ Ready to accept requests\n');
});
