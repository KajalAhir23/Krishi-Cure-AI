/**
 * Environment Configuration
 * Validates and exports environment variables
 */

import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  // Server
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // API Keys
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,

  // Firebase
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};

/**
 * Validates that required environment variables are set
 */
export function validateEnvironment() {
  const isDevelopment = ENV.NODE_ENV === 'development';
  const errors = [];

  // Check for at least one AI service API key
  if (!ENV.GROQ_API_KEY && !ENV.GEMINI_API_KEY) {
    errors.push('At least one AI service key (GROQ_API_KEY or GEMINI_API_KEY) is required');
  }

  // Firebase configuration is optional but warn if missing
  if (!ENV.FIREBASE_PROJECT_ID) {
    console.warn('⚠️  Firebase configuration not set - authentication may not work');
  }

  if (errors.length > 0) {
    console.error('❌ Environment validation failed:');
    errors.forEach(err => console.error(`   - ${err}`));
    if (!isDevelopment) {
      process.exit(1);
    }
  } else {
    console.log('✅ Environment configuration valid');
  }
}

export default ENV;
