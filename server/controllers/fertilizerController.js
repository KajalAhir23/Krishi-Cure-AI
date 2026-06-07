/**
 * Fertilizer Controller - Refactored
 * Handles fertilizer calculation endpoint
 */

import { fertilizerService } from '../services/fertilizerService.js';
import { validateLanguage } from '../validators/inputValidator.js';
import { createSuccessResponse, createErrorResponse } from '../utils/errorHandler.js';
import { CONFIG } from '../config/constants.js';

/**
 * Handles fertilizer calculation request
 * POST /api/fertilizer/calculate
 */
export async function calculateFertilizerController(req, res) {
  try {
    const { cropId, fertilizerId, areaUnit, areaValue, lang } = req.body;
    const selectedLang = validateLanguage(lang);

    // Calculate fertilizer requirements
    const result = fertilizerService.calculateFertilizerRequirements({
      cropId,
      fertilizerId,
      areaUnit,
      areaValue,
      lang: selectedLang
    });

    res.json(createSuccessResponse(result, 'Fertilizer calculation completed'));
  } catch (error) {
    console.error('[Fertilizer Calculation Error]', error);
    res.status(500).json(
      createErrorResponse(CONFIG.ERRORS.AI_SERVICE_ERROR, 500)
    );
  }
}

export default { calculateFertilizerController };
