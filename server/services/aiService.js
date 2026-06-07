/**
 * AI Service - Centralized AI Integration
 * Handles communication with Groq and Gemini APIs
 * Manages caching and fallback logic
 */

import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import { CONFIG } from '../config/constants.js';
import { ENV } from '../config/environment.js';

class AIService {
  constructor() {
    this.diagnosisCache = {};
    this.chatCache = {};
  }

  /**
   * Classifies confidence score into levels
   * @param {number} score - Confidence score (0-100)
   * @returns {Object} - Confidence level info
   */
  classifyConfidence(score) {
    const numericScore = typeof score === 'number' ? score : parseInt(score, 10) || 0;

    if (numericScore >= CONFIG.CONFIDENCE.HIGH_THRESHOLD) {
      return {
        level: CONFIG.CONFIDENCE.LEVELS.HIGH,
        color: CONFIG.CONFIDENCE.COLORS.HIGH
      };
    } else if (numericScore > CONFIG.CONFIDENCE.MEDIUM_THRESHOLD) {
      return {
        level: CONFIG.CONFIDENCE.LEVELS.MEDIUM,
        color: CONFIG.CONFIDENCE.COLORS.MEDIUM
      };
    }
    return {
      level: CONFIG.CONFIDENCE.LEVELS.LOW,
      color: CONFIG.CONFIDENCE.COLORS.LOW
    };
  }

  /**
   * Calls Groq API for text generation
   * @param {Array} messages - Chat messages
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - Generated response
   * @throws {Error} - If API fails
   */
  async callGroqAPI(messages, options = {}) {
    if (!ENV.GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    const groq = new Groq({ apiKey: ENV.GROQ_API_KEY });

    const requestConfig = {
      messages,
      model: CONFIG.AI_MODELS.GROQ.MODEL_ID,
      temperature: options.temperature || 0.2,
      ...options
    };

    if (options.jsonMode) {
      requestConfig.response_format = { type: 'json_object' };
    }

    const completion = await groq.chat.completions.create(requestConfig);
    return completion.choices[0].message.content;
  }

  /**
   * Calls Gemini API for text generation
   * @param {string} content - Text content or prompt
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - Generated response
   * @throws {Error} - If API fails
   */
  async callGeminiAPI(content, options = {}) {
    if (!ENV.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

    const config = {
      temperature: options.temperature || 0.2,
      ...options
    };

    if (options.jsonMode) {
      config.responseMimeType = 'application/json';
    }

    const response = await ai.models.generateContent({
      model: CONFIG.AI_MODELS.GEMINI.MODEL_ID,
      contents: content,
      config
    });

    return response.text;
  }

  /**
   * Generates diagnosis with AI (with fallback)
   * @param {Object} input - Diagnosis input
   * @returns {Promise<Object>} - Diagnosis result
   */
  async generateDiagnosis(input) {
    const { cropName, symptoms, lang = 'en' } = input;

    // Try Groq first
    if (ENV.GROQ_API_KEY) {
      try {
        console.log('📡 Using Groq for diagnosis...');
        return await this.diagnoseWithGroq(cropName, symptoms, lang);
      } catch (error) {
        console.warn('⚠️  Groq failed, trying Gemini:', error.message);
      }
    }

    // Fallback to Gemini
    if (ENV.GEMINI_API_KEY) {
      try {
        console.log('📡 Using Gemini for diagnosis...');
        return await this.diagnoseWithGemini(cropName, symptoms, lang);
      } catch (error) {
        console.error('❌ Gemini also failed:', error.message);
      }
    }

    throw new Error('No AI service available for diagnosis');
  }

  /**
   * Generates chat response with AI (with fallback)
   * @param {string} question - User question
   * @param {string} lang - Language code
   * @param {Array} history - Conversation history
   * @returns {Promise<Object>} - Chat response
   */
  async generateChatResponse(question, lang = 'en', history = []) {
    // Try Groq first
    if (ENV.GROQ_API_KEY) {
      try {
        console.log('📡 Using Groq for chat...');
        return await this.chatWithGroq(question, lang, history);
      } catch (error) {
        console.warn('⚠️  Groq failed, trying Gemini:', error.message);
      }
    }

    // Fallback to Gemini
    if (ENV.GEMINI_API_KEY) {
      try {
        console.log('📡 Using Gemini for chat...');
        return await this.chatWithGemini(question, lang, history);
      } catch (error) {
        console.error('❌ Gemini also failed:', error.message);
      }
    }

    throw new Error('No AI service available for chat');
  }

  /**
   * Diagnoses with Groq API
   * @private
   */
  async diagnoseWithGroq(cropName, symptoms, lang) {
    const systemInstruction = this.buildDiagnosisSystemPrompt();
    const taskPrompt = this.buildDiagnosisTaskPrompt(cropName, symptoms, lang);

    const response = await this.callGroqAPI(
      [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: taskPrompt }
      ],
      {
        temperature: CONFIG.AI_MODELS.GROQ.TEMPERATURE_DIAGNOSIS,
        jsonMode: true,
        max_tokens: 1500
      }
    );

    const result = JSON.parse(response);
    const confidence = this.classifyConfidence(result.confidence_score);

    return {
      ...result,
      confidence_level: confidence.level,
      severity_color: confidence.color,
      provider: 'groq'
    };
  }

  /**
   * Diagnoses with Gemini API
   * @private
   */
  async diagnoseWithGemini(cropName, symptoms, lang) {
    const systemInstruction = this.buildDiagnosisSystemPrompt();
    const taskPrompt = this.buildDiagnosisTaskPrompt(cropName, symptoms, lang);

    const response = await this.callGeminiAPI(taskPrompt, {
      temperature: CONFIG.AI_MODELS.GEMINI.TEMPERATURE_DIAGNOSIS,
      jsonMode: true,
      systemInstruction
    });

    const result = JSON.parse(response);
    const confidence = this.classifyConfidence(result.confidence_score);

    return {
      ...result,
      confidence_level: confidence.level,
      severity_color: confidence.color,
      provider: 'gemini'
    };
  }

  /**
   * Chat with Groq API
   * @private
   */
  async chatWithGroq(question, lang, history) {
    const systemPrompt = this.buildChatSystemPrompt(lang);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: question }
    ];

    const response = await this.callGroqAPI(messages, {
      temperature: CONFIG.AI_MODELS.GROQ.TEMPERATURE_CHAT,
      max_tokens: CONFIG.AI_MODELS.GROQ.MAX_TOKENS_CHAT
    });

    return {
      success: true,
      reply: response,
      provider: 'groq'
    };
  }

  /**
   * Chat with Gemini API
   * @private
   */
  async chatWithGemini(question, lang, history) {
    const systemPrompt = this.buildChatSystemPrompt(lang);

    const response = await this.callGeminiAPI(question, {
      temperature: CONFIG.AI_MODELS.GEMINI.TEMPERATURE_CHAT,
      systemInstruction: systemPrompt
    });

    return {
      success: true,
      reply: response,
      provider: 'gemini'
    };
  }

  /**
   * Builds diagnosis system prompt
   * @private
   */
  buildDiagnosisSystemPrompt() {
    return `You are an elite Agricultural Scientist from ICAR (Indian Council of Agricultural Research) helping rural farmers.
Provide highly accurate symptom-based crop disease diagnosis using simple, clear, everyday conversational language.
Avoid complex scientific or technical terms. Use only common local words that farmers understand.`;
  }

  /**
   * Builds diagnosis task prompt
   * @private
   */
  buildDiagnosisTaskPrompt(cropName, symptoms, lang) {
    const langName = CONFIG.LANGUAGES.LANGUAGE_NAMES[lang] || 'English';

    return `Task: Carefully analyze these symptoms for ${cropName} and identify the top 3 possible diseases, pests, or deficiencies.
Symptoms: ${Array.isArray(symptoms) ? symptoms.join(', ') : symptoms}
Language Requested: ${langName}

Output Requirement: You MUST respond ONLY with a valid JSON object (no markdown, no code blocks).
Make the diagnosis scientifically accurate but use extremely simple, colloquial words in the requested language.

Format of the JSON object:
{
    "disease_name": "Common local disease name in requested language",
    "confidence_score": 85,
    "crop_health_score": 80,
    "risk_level": "High|Medium|Low",
    "yield_impact": "High|Medium|Low",
    "disease_explanation": "Very simple 1-sentence explanation",
    "organic_treatment": ["Step 1", "Step 2", "Step 3"],
    "chemical_treatment": ["Step 1", "Step 2"],
    "prevention_methods": ["Prevention 1", "Prevention 2"],
    "recovery_details": {
        "chances": "High|Medium|Low",
        "time": "7-10 days",
        "unrecoverable_signs": "Warning sign"
    },
    "fertilizer_suggestions": "Simple advice",
    "irrigation_recommendations": "Watering advice",
    "weather_precautions": "Weather tips",
    "early_warning_signs": "Early signs to watch",
    "nearest_action": "Contact KVK",
    "top_diseases": [
        {"name": "Disease name", "confidence": 85},
        {"name": "Disease 2", "confidence": 55},
        {"name": "Disease 3", "confidence": 30}
    ]
}`;
  }

  /**
   * Builds chat system prompt
   * @private
   */
  buildChatSystemPrompt(lang) {
    const langName = CONFIG.LANGUAGES.LANGUAGE_NAMES[lang] || 'English';

    return `You are Krishi Cure AI Agriculture Assistant. 
Answer only agriculture and farming related questions in ${langName}.
Use simple, farmer-friendly language. Give practical and accurate advice based on government agriculture recommendations and KVK guidance.
If unsure, clearly state limitations. Keep answers concise and practical.
If a question is not related to agriculture, politely decline and explain you can only help with farming topics.`;
  }

  /**
   * Clears all caches
   */
  clearCache() {
    this.diagnosisCache = {};
    this.chatCache = {};
    console.log('AI Service cache cleared');
  }
}

// Export singleton instance
export const aiService = new AIService();

export default aiService;
