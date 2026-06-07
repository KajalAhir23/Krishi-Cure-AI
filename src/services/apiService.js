/**
 * API Service - Frontend
 * Centralized API communication layer
 * Handles all backend API calls with error handling and retry logic
 */

const API_BASE_URL = '/api';

/**
 * Makes API request with proper error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} - API response
 */
async function apiRequest(endpoint, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

/**
 * API Service Object
 * Contains all API methods used by the frontend
 */
const ApiService = {
  /**
   * Gets master data (crops, symptoms, translations)
   * @returns {Promise<Object>}
   */
  getMasterData: async () => {
    return apiRequest('/data');
  },

  /**
   * Gets Firebase configuration
   * @returns {Promise<Object>}
   */
  getFirebaseConfig: async () => {
    return apiRequest('/firebase-config');
  },

  /**
   * Diagnoses crop disease by symptoms
   * @param {Object} data - Request data
   * @returns {Promise<Object>}
   */
  diagnoseBySymptomsAsync: async (data) => {
    return apiRequest('/diagnose', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Diagnoses crop disease by image
   * @param {Object} data - Request data
   * @returns {Promise<Object>}
   */
  diagnoseByImageAsync: async (data) => {
    return apiRequest('/diagnose-image', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Gets chatbot response
   * @param {Object} data - Request data
   * @returns {Promise<Object>}
   */
  chatbotAsync: async (data) => {
    return apiRequest('/chatbot', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Calculates fertilizer requirements
   * @param {Object} data - Request data
   * @returns {Promise<Object>}
   */
  calculateFertilizerAsync: async (data) => {
    return apiRequest('/fertilizer/calculate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export default ApiService;
