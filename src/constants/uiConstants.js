/**
 * Frontend Constants
 * Centralized constants for UI and application logic
 */

export const LANGUAGE = {
  ENGLISH: 'en',
  HINDI: 'hi',
  GUJARATI: 'gu',
  DEFAULT: 'en',
  STORAGE_KEY: 'krishiLang',
  NAMES: {
    en: 'English',
    hi: 'हिन्दी',
    gu: 'ગુજરાતી'
  }
};

export const STORAGE_KEYS = {
  LANGUAGE: 'krishiLang',
  AUTH_TOKEN: 'authToken',
  USER_INFO: 'userInfo',
  IS_LOGGED_IN: 'isLoggedIn',
  DIAGNOSIS_RESULT: 'diagnosisResult',
  CHAT_HISTORY: 'chatHistory'
};

export const UI_MESSAGES = {
  LOADING: {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    gu: 'લોડ થઈ રહ્યું છે...'
  },
  ERROR: {
    en: 'An error occurred. Please try again.',
    hi: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    gu: 'એક ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.'
  },
  SUCCESS: {
    en: 'Success!',
    hi: 'सफल!',
    gu: 'સફલ!'
  },
  ANALYZING: {
    en: 'Analyzing with AI...',
    hi: 'AI से विश्लेषण हो रहा है...',
    gu: 'AI સાથે વિશ્લેષણ થઈ રહ્યું છે...'
  }
};

export const TOAST_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

export const CROP_CATEGORIES = {
  FIELD_CROPS: 'fieldCrops',
  FRUITS: 'fruits',
  VEGETABLES: 'vegetables'
};

export const AREA_UNITS = ['Bigha', 'Acre', 'Hectare'];

export const CONFIDENCE_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

export const RISK_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

export const PAGES = {
  HOME: '/index.html',
  LOGIN: '/login.html',
  DIAGNOSIS_CHOICE: '/diagnosis-choice.html',
  SYMPTOMS: '/symptoms.html',
  UPLOAD: '/upload.html',
  RESULT: '/result.html',
  FERTILIZER: '/fertilizer-calculator.html',
  CHATBOT: '/chatbot.html'
};
