/**
 * Request Validation Middleware
 * Validates incoming requests before processing
 */

import {
  validateDiagnosisInput,
  validateImageDiagnosisInput,
  validateChatbotInput,
  validateFertilizerInput
} from '../validators/inputValidator.js';
import { createErrorResponse } from '../utils/errorHandler.js';

/**
 * Validates diagnosis endpoint request
 */
export function validateDiagnosis(req, res, next) {
  const validation = validateDiagnosisInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json(createErrorResponse(validation.error, 400));
  }
  next();
}

/**
 * Validates image diagnosis endpoint request
 */
export function validateImageDiagnosis(req, res, next) {
  const validation = validateImageDiagnosisInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json(createErrorResponse(validation.error, 400));
  }
  next();
}

/**
 * Validates chatbot endpoint request
 */
export function validateChatbot(req, res, next) {
  const validation = validateChatbotInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json(createErrorResponse(validation.error, 400));
  }
  next();
}

/**
 * Validates fertilizer endpoint request
 */
export function validateFertilizer(req, res, next) {
  const validation = validateFertilizerInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json(createErrorResponse(validation.error, 400));
  }
  next();
}
