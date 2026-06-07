/**
 * Chatbot Controller - Refactored
 * Handles agriculture chatbot endpoint
 */

import { aiService } from '../services/aiService.js';
import { validateLanguage } from '../validators/inputValidator.js';
import { createSuccessResponse, createErrorResponse } from '../utils/errorHandler.js';
import { CONFIG } from '../config/constants.js';

/**
 * Handles chatbot questions
 * POST /api/chatbot
 */
export async function chatbotController(req, res) {
  try {
    const { question, lang, history } = req.body;
    const selectedLang = validateLanguage(lang);
    const conversationHistory = Array.isArray(history) ? history : [];

    // Generate chat response using AI service
    const response = await aiService.generateChatResponse(
      question,
      selectedLang,
      conversationHistory
    );

    res.json(createSuccessResponse(response, 'Chat response generated successfully'));
  } catch (error) {
    console.error('[Chatbot Error]', error);

    // Determine appropriate error message based on language
    const errorMessages = {
      en: 'Sorry, the AI service is temporarily unavailable. Please try again in a few minutes.',
      hi: 'क्षमा करें, AI सेवा अभी उपलब्ध नहीं है। कृपया कुछ मिनट बाद पुनः प्रयास करें।',
      gu: 'માફ કરશો, AI સેવા હાલ ઉપલબ્ધ નથી. કૃપા કરીને થોડી મિનિટ પછી ફરી પ્રયાસ કરો।'
    };

    const lang = req.body.lang || 'en';
    const selectedLang = validateLanguage(lang);
    const errorMsg = errorMessages[selectedLang] || errorMessages.en;

    res.status(500).json(createSuccessResponse({
      success: false,
      reply: errorMsg,
      provider: 'none'
    }, null));
  }
}

export default { chatbotController };
