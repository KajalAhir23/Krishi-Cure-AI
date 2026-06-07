/**
 * API Routes - Refactored
 * Professional API endpoint definitions
 */

import express from 'express';
import { getMasterDataController, getFirebaseConfigController } from '../controllers/dataController.js';
import { diagnoseBySymptomsController, diagnoseByImageController } from '../controllers/diagnosisController.js';
import { chatbotController } from '../controllers/chatbotController.js';
import { calculateFertilizerController } from '../controllers/fertilizerController.js';
import {
  validateDiagnosis,
  validateImageDiagnosis,
  validateChatbot,
  validateFertilizer
} from '../utils/validationMiddleware.js';

const router = express.Router();

/**
 * Data Endpoints
 */

/**
 * GET /api/data
 * Returns master data: crops list, symptoms, and translations
 */
router.get('/data', getMasterDataController);

/**
 * GET /api/firebase-config
 * Returns Firebase configuration for client-side authentication
 */
router.get('/firebase-config', getFirebaseConfigController);

/**
 * Diagnosis Endpoints
 */

/**
 * POST /api/diagnose
 * Symptom-based disease diagnosis
 *
 * Request Body:
 * {
 *   "cropId": "wheat",
 *   "symptoms": ["symptom1", "symptom2"],
 *   "lang": "en"
 * }
 */
router.post('/diagnose', validateDiagnosis, diagnoseBySymptomsController);

/**
 * POST /api/diagnose-image
 * Image-based disease diagnosis
 *
 * Request Body:
 * {
 *   "cropId": "wheat",
 *   "images": ["base64_image_1", "base64_image_2"],
 *   "symptoms": ["symptom1"],
 *   "lang": "en"
 * }
 */
router.post('/diagnose-image', validateImageDiagnosis, diagnoseByImageController);

/**
 * Chatbot Endpoint
 */

/**
 * POST /api/chatbot
 * General agriculture Q&A chatbot
 *
 * Request Body:
 * {
 *   "question": "How to grow wheat?",
 *   "lang": "en",
 *   "history": []
 * }
 */
router.post('/chatbot', validateChatbot, chatbotController);

/**
 * Fertilizer Endpoint
 */

/**
 * POST /api/fertilizer/calculate
 * Calculate fertilizer requirements
 *
 * Request Body:
 * {
 *   "cropId": "wheat",
 *   "fertilizerId": "urea",
 *   "areaUnit": "Acre",
 *   "areaValue": 5,
 *   "lang": "en"
 * }
 */
router.post('/fertilizer/calculate', validateFertilizer, calculateFertilizerController);

export default router;
