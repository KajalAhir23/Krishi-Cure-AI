/**
 * Data Controller - Refactored
 * Handles master data and configuration endpoints
 */

import { dataService } from '../services/dataService.js';
import { ENV } from '../config/environment.js';
import { createSuccessResponse, createErrorResponse } from '../utils/errorHandler.js';
import { CONFIG } from '../config/constants.js';

/**
 * Serves master data (crops, symptoms, translations)
 * GET /api/data
 */
export async function getMasterDataController(req, res) {
  try {
    const data = await dataService.getCropsData();

    if (!data) {
      return res.status(500).json(
        createErrorResponse(CONFIG.ERRORS.FAILED_LOAD_DATA, 500)
      );
    }

    res.json(createSuccessResponse({
      cropsList: data.cropsList,
      symptomsList: data.symptomsList,
      langStore: data.langStore
    }, 'Master data loaded successfully'));
  } catch (error) {
    console.error('[Master Data Error]', error);
    res.status(500).json(
      createErrorResponse(CONFIG.ERRORS.FAILED_LOAD_DATA, 500)
    );
  }
}

/**
 * Serves Firebase configuration
 * GET /api/firebase-config
 * 
 * Note: Configuration is loaded from environment variables
 * Never expose sensitive keys - only public config is sent to client
 */
export function getFirebaseConfigController(req, res) {
  res.json(createSuccessResponse({
    apiKey: ENV.FIREBASE_API_KEY || CONFIG.FIREBASE.API_KEY,
    authDomain: ENV.FIREBASE_AUTH_DOMAIN || CONFIG.FIREBASE.AUTH_DOMAIN,
    projectId: ENV.FIREBASE_PROJECT_ID || CONFIG.FIREBASE.PROJECT_ID,
    storageBucket: ENV.FIREBASE_STORAGE_BUCKET || CONFIG.FIREBASE.STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID || CONFIG.FIREBASE.MESSAGING_SENDER_ID,
    appId: ENV.FIREBASE_APP_ID || CONFIG.FIREBASE.APP_ID
  }, 'Firebase configuration loaded'));
}

export default {
  getMasterDataController,
  getFirebaseConfigController
};
