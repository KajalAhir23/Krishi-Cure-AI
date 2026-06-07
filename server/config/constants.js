/**
 * Application Configuration Constants
 * Centralized configuration for the Krishi Cure AI application
 */

export const CONFIG = {
  // Server Configuration
  SERVER: {
    PORT: process.env.PORT || 3000,
    ENVIRONMENT: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
  },

  // Rate Limiting Configuration
  RATE_LIMIT: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS_PER_WINDOW: 60,
    MESSAGE: 'Too many requests, please try again later.'
  },

  // Request Payload Limits
  REQUEST: {
    MAX_PAYLOAD_SIZE: '50mb',
    MAX_JSON_SIZE: '50mb'
  },

  // Cache Configuration
  CACHE: {
    TTL_DIAGNOSIS: 3600000, // 1 hour
    TTL_DATA: 3600000 // 1 hour
  },

  // API Timeouts
  TIMEOUT: {
    FETCH_DEFAULT: 8000, // 8 seconds
    AI_SERVICE: 30000 // 30 seconds
  },

  // Supported Languages
  LANGUAGES: {
    EN: 'en',
    HI: 'hi',
    GU: 'gu',
    DEFAULT: 'en',
    LANGUAGE_NAMES: {
      en: 'English',
      hi: 'Hindi',
      gu: 'Gujarati'
    }
  },

  // AI Models Configuration
  AI_MODELS: {
    GROQ: {
      MODEL_ID: 'llama-3.3-70b-versatile',
      MAX_TOKENS_CHAT: 512,
      TEMPERATURE_DIAGNOSIS: 0.2,
      TEMPERATURE_CHAT: 0.4
    },
    GEMINI: {
      MODEL_ID: 'gemini-2.5-flash',
      TEMPERATURE_DIAGNOSIS: 0.2,
      TEMPERATURE_CHAT: 0.4
    }
  },

  // Confidence Levels
  CONFIDENCE: {
    HIGH_THRESHOLD: 70,
    MEDIUM_THRESHOLD: 30,
    LOW_THRESHOLD: 0,
    LEVELS: {
      HIGH: 'High',
      MEDIUM: 'Medium',
      LOW: 'Low'
    },
    COLORS: {
      HIGH: 'Green',
      MEDIUM: 'Yellow',
      LOW: 'Red'
    }
  },

  // Risk Levels
  RISK_LEVEL: {
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low'
  },

  // Fertilizer Configuration
  FERTILIZER: {
    // Area unit conversion to hectares
    AREA_CONVERSION: {
      BIGHA: 0.25,
      ACRE: 0.4047,
      HECTARE: 1
    },
    AREA_UNITS: ['Bigha', 'Acre', 'Hectare']
  },

  // Firebase Configuration (loaded from environment)
  FIREBASE: {
    API_KEY: process.env.FIREBASE_API_KEY || 'AIzaSyPlaceholderKey-ChangeMe',
    AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || 'krishi-cure-ai.firebaseapp.com',
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'krishi-cure-ai',
    STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || 'krishi-cure-ai.appspot.com',
    MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '1234567890',
    APP_ID: process.env.FIREBASE_APP_ID || '1:1234567890:web:abcdef123456'
  },

  // Error Messages
  ERRORS: {
    MISSING_CROP_ID: 'Missing cropId parameter',
    MISSING_SYMPTOMS: 'Missing or invalid symptoms',
    MISSING_IMAGES: 'Missing or invalid images',
    MISSING_QUESTION: 'Question is required',
    INVALID_AREA_VALUE: 'Area value must be a positive number',
    INVALID_FERTILIZER_PARAMS: 'Missing required fertilizer parameters',
    FAILED_LOAD_DATA: 'Failed to load master crops data',
    AI_SERVICE_ERROR: 'Error generating response from AI service',
    SERVER_ERROR: 'Something went wrong on the server'
  },

  // Success Messages
  SUCCESS: {
    DIAGNOSIS_GENERATED: 'Diagnosis generated successfully'
  }
};

export default CONFIG;
