/**
 * Diagnosis Controller - Refactored
 * Handles disease diagnosis endpoints
 */

import { aiService } from '../services/aiService.js';
import { dataService } from '../services/dataService.js';
import { validateLanguage } from '../validators/inputValidator.js';
import { createSuccessResponse, createErrorResponse } from '../utils/errorHandler.js';
import { CONFIG } from '../config/constants.js';

/**
 * Handles symptom-based diagnosis
 * POST /api/diagnose
 */
export async function diagnoseBySymptomsController(req, res) {
  try {
    const { cropId, symptoms, lang } = req.body;
    const selectedLang = validateLanguage(lang);

    // Get crop name
    const cropName = await dataService.getCropName(cropId, selectedLang);
    if (!cropName) {
      return res.status(400).json(
        createErrorResponse('Invalid crop ID', 400)
      );
    }

    // Convert symptom IDs to names
    const symptomNames = await dataService.convertSymptomIds(
      Array.isArray(symptoms) ? symptoms : [symptoms],
      selectedLang
    );

    // Get crop profile for context
    const cropProfile = await dataService.getCropProfile(cropId);

    // Generate diagnosis using AI service
    const diagnosis = await aiService.generateDiagnosis({
      cropName,
      symptoms: symptomNames,
      lang: selectedLang
    });

    res.json(createSuccessResponse(diagnosis, CONFIG.SUCCESS.DIAGNOSIS_GENERATED));
  } catch (error) {
    console.error('[Diagnosis Error]', error);
    res.status(500).json(
      createErrorResponse(CONFIG.ERRORS.AI_SERVICE_ERROR, 500)
    );
  }
}

/**
 * Handles image-based diagnosis
 * POST /api/diagnose-image
 */
export async function diagnoseByImageController(req, res) {
  try {
    const { cropId, images, symptoms, lang } = req.body;
    const selectedLang = validateLanguage(lang);

    // Get crop name
    const cropName = await dataService.getCropName(cropId, selectedLang);
    if (!cropName) {
      return res.status(400).json(
        createErrorResponse('Invalid crop ID', 400)
      );
    }

    // Convert symptom IDs to names if provided
    let symptomNames = [];
    if (symptoms && symptoms.length > 0) {
      symptomNames = await dataService.convertSymptomIds(
        Array.isArray(symptoms) ? symptoms : [symptoms],
        selectedLang
      );
    }

    // Generate diagnosis using AI service
    const diagnosis = await aiService.generateDiagnosis({
      cropName,
      symptoms: symptomNames,
      images,
      lang: selectedLang
    });

    res.json(createSuccessResponse(diagnosis, CONFIG.SUCCESS.DIAGNOSIS_GENERATED));
  } catch (error) {
    console.error('[Image Diagnosis Error]', error);
    res.status(500).json(
      createErrorResponse(CONFIG.ERRORS.AI_SERVICE_ERROR, 500)
    );
  }
}

export default {
  diagnoseBySymptomsController,
  diagnoseByImageController
};
