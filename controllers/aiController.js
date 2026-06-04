import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

const diagnosisCache = {};
const CACHE_TTL = 3600000; // 1 hour

export function classifyConfidence(score) {
    const numericScore = typeof score === 'number' ? score : parseInt(score, 10) || 0;
    if (numericScore < 30) {
        return { level: "Low", label: "Low Confidence", color: "Red" };
    } else if (numericScore <= 70) {
        return { level: "Medium", label: "Medium Confidence", color: "Yellow" };
    } else {
        return { level: "High", label: "High Confidence", color: "Green" };
    }
}

function buildFallbackResponse(lang) {
    const isGu = lang === 'gu';
    const isHi = lang === 'hi';
    return {
        disease_name: isGu ? "અજ્ઞાત સમસ્યા" : isHi ? "अज्ञात समस्या" : "Unknown Issue",
        confidence_level: "Low",
        confidence_score: 0,
        crop_health_score: 50,
        risk_level: "Medium",
        yield_impact: isGu ? "મધ્યમ" : isHi ? "मध्यम" : "Medium",
        severity_color: "Yellow",
        disease_explanation: isGu ? "તમારા પાકમાં કોઈ અજ્ઞાત રોગ જોવા મળ્યો છે." : isHi ? "आपकी फसल में कोई अज्ञात बीमारी देखी गई है।" : "An unknown issue was detected on your crop.",
        observed_symptoms: isGu ? "ચિત્રો અથવા લક્ષણો અસ્પષ્ટ છે." : isHi ? "चित्र या लक्षण अस्पष्ट हैं।" : "Images or symptoms are unclear.",
        possible_causes: isGu ? "નબળી રોશની અથવા અપૂરતી માહિતી." : isHi ? "कम रोशनी या अपर्याप्त जानकारी।" : "Poor lighting or insufficient information.",
        recovery_details: {
            chances: "Medium",
            time: isGu ? "૭-૧૦ દિવસ" : isHi ? "७-१० दिन" : "7-10 days",
            unrecoverable_signs: isGu ? "જો આખો છોડ સુકાઈ જાય" : isHi ? "यदि पूरा पौधा सूख जाए" : "If the entire plant dries up completely"
        },
        organic_treatment: [
            isGu ? "કડો લીમડાના તેલનું મિશ્રણ બનાવો." : isHi ? "नीम के तेल का मिश्रण बनाएं।" : "Make a bitter neem oil mixture.",
            isGu ? "આ દવા છોડ પર વહેલી સવારે છાંટો." : isHi ? "यह दवा सुबह पौधों पर छिड़कें।" : "Spray it on plants early in the morning.",
            isGu ? "બીમાર પાંદડા તોડીને જમીનમાં દાટો." : isHi ? "बीमार पत्तियों को तोड़कर जमीन में गाड़ें।" : "Uproot diseased leaves and bury them."
        ],
        chemical_treatment: [
            isGu ? "કોપર ઓક્સિક્લોરાઇડ (૨ ગ્રામ/લીટર) વાપરો." : isHi ? "कॉपर ऑक्सीक्लोराइड (२ ग्राम/लीटर) का प्रयोग करें।" : "Use Copper Oxychloride (2g/liter).",
            isGu ? "સાંજના સમયે માસ્ક પહેરીને દવા છાંટો." : isHi ? "शाम के समय मास्क पहनकर छिड़काव करें।" : "Spray in the evening wearing a protective mask."
        ],
        prevention_methods: [
            isGu ? "પાક ફેરબદલી પદ્ધતિ અપનાવો." : isHi ? "फसल चक्र अपनाएं।" : "Adopt crop rotation methods.",
            isGu ? "બીજ વાવતા પહેલા તેની માવજત કરો." : isHi ? "बीज बोने से पहले उपचार करें।" : "Treat seeds before sowing."
        ],
        fertilizer_suggestions: isGu ? "જમીન ચકાસણી મુજબ દેશી સેન્દ્રિય ખાતર આપો." : isHi ? "मिट्टी की जांच के अनुसार जैविक खाद डालें।" : "Apply organic manure based on soil test results.",
        irrigation_recommendations: isGu ? "ટપક પદ્ધતિનો ઉપયોગ કરો અને પાણી ભરાવા ન દો." : isHi ? "टपक सिंचाई अपनाएं और खेतों में पानी जमा न होने दें।" : "Use drip irrigation and prevent water stagnation.",
        weather_precautions: isGu ? "વાદળછાયા વાતાવરણમાં છંટકાવ કરવાનું ટાળો." : isHi ? "बादल छाए रहने पर छिड़काव न करें।" : "Avoid spraying during cloudy weather.",
        early_warning_signs: isGu ? "નીચલા પાંદડા પીળા પડવા." : isHi ? "निचले पत्तों का पीला पड़ना।" : "Yellowing of the bottom-most leaves.",
        nearest_action: isGu ? "નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) નો સંપર્ક કરો." : isHi ? "निकटतम कृषि विज्ञान केंद्र (KVK) से संपर्क करें।" : "Contact your nearest KVK extension center.",
        top_diseases: [
            { "name": isGu ? "અજ્ઞાત રોગ" : isHi ? "अज्ञात रोग" : "Unknown Issue", "confidence": 40 }
        ]
    };
}

export async function diagnoseWithAI(cropName, symptoms, cropProfile, lang) {
    const cacheKey = `${cropName}_${symptoms.sort().join(',')}_${lang}`;
    const cached = diagnosisCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return cached.data;
    }

    const systemInstruction = `You are an elite Agricultural Scientist from ICAR (Indian Council of Agricultural Research) helping rural, uneducated farmers.
Provide highly accurate symptom-based crop disease diagnosis using extremely simple, clear, everyday conversational language.
Avoid any complex scientific, technical, or academic terms. Use only common local words that a rural farmer understands.`;

    const taskPrompt = `Task: Carefully analyze these symptoms for ${cropName} and accurately identify the top 3 possible diseases, pests, or deficiencies.
Symptoms: ${symptoms.join(", ")}
Note: ${symptoms.length === 1 ? "Only ONE symptom is provided. Still give the best possible diagnosis based on this single symptom. Be confident but note that accuracy improves with more symptoms." : "Multiple symptoms provided — cross-reference for maximum accuracy."}
Language Requested: ${lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English'}

Output Requirement: You MUST respond ONLY with a valid JSON object (no markdown, no code blocks).
Ensure the diagnosis is scientifically accurate based on the symptoms, but translate the language into extremely simple, colloquial words.

CRITICAL LANGUAGE INSTRUCTIONS - Use very easy, everyday words:
- NEVER use heavy traditional names like "Jivamrut", "Bijamrut", "Amritpani". Instead, use terms like "cow dung and urine mixture", "neem spray", "homemade mixture".
- In Gujarati:
  * Avoid words like "દ્રાવણ" (solution), "સારવાર" (treatment), "નિયમિત" (regular), "અટકાવ" (prevention).
  * Use "મિશ્રણ" (mixture), "દવા" (medicine), "ઉપાય" (solution/cure), "નિયમ પ્રમાણે" (regularly/properly), "બચાવ" (prevention/save), "મૂળિયાં" (roots).
- In Hindi:
  * Avoid heavy Sanskritized or formal words. Use simple colloquial terms.

Format of the JSON object:
{
    "disease_name": "Common local name of the primary disease in the requested language (extremely simple)",
    "confidence_score": 85,
    "confidence_level": "High" | "Medium" | "Low",
    "crop_health_score": 80, // overall health percentage (0-100)
    "risk_level": "High" | "Medium" | "Low",
    "yield_impact": "High" | "Medium" | "Low", // predicted impact on harvest
    "severity_color": "Red" | "Yellow" | "Green",
    "disease_explanation": "Very simple 1-sentence explanation of the disease in easy language",
    "recovery_details": {
        "chances": "High" | "Medium" | "Low",
        "time": "e.g., 7-10 days (in requested language)",
        "unrecoverable_signs": "1 simple warning sign showing when the crop cannot be saved anymore"
    },
    "organic_treatment": [
        "Step 1: Preparation (1 very simple, short sentence on how to make the remedy in conversational language)",
        "Step 2: Application (1 very simple, short sentence on how to put it on the plant in conversational language)",
        "Step 3: Prevention/Take Care (1 very simple, short sentence on what to do next to save the plant)"
    ],
    "chemical_treatment": [
        "Step 1: Emergency Chemical (1 simple sentence on safe chemical control like Copper Oxychloride spray in requested language)",
        "Step 2: Safety Rule (1 simple safety rule when spraying)"
    ],
    "prevention_methods": [
        "Prevention 1 (1 simple prevention step in requested language)",
        "Prevention 2 (1 simple prevention step in requested language)"
    ],
    "fertilizer_suggestions": "Simple, everyday advice on fertilizers or compost in requested language",
    "irrigation_recommendations": "Simple watering advice (e.g. how much water to give now) in requested language",
    "weather_precautions": "Simple weather-related advice for the crop in requested language",
    "early_warning_signs": "Simple early signs to watch out for in requested language",
    "nearest_action": "Simple action step to contact local extension officer or KVK in requested language",
    "top_diseases": [
        { "name": "Primary predicted disease name in requested language", "confidence": 85 },
        { "name": "Second possible disease name in requested language", "confidence": 55 },
        { "name": "Third possible disease name in requested language", "confidence": 30 }
    ]
}

The treatments and descriptions must be highly practical, trusted, and based on ICAR, agricultural university, or KVK books. All array sentences must be under 12 words.`;

    if (process.env.GROQ_API_KEY) {
        try {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: taskPrompt }
                ],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: "json_object" }
            });

            const jsonText = chatCompletion.choices[0].message.content;
            const result = JSON.parse(jsonText);

            const conf = classifyConfidence(result.confidence_score);
            result.confidence_level = conf.level;
            result.severity_color = conf.color;

            diagnosisCache[cacheKey] = {
                timestamp: Date.now(),
                data: result
            };
            return result;
        } catch (groqError) {
            console.warn("Groq API Error, falling back to Gemini:", groqError.message || groqError);
        }
    }

    if (process.env.GEMINI_API_KEY) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: taskPrompt,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    temperature: 0.2
                }
            });

            const jsonText = response.text;
            const result = JSON.parse(jsonText);

            const conf = classifyConfidence(result.confidence_score);
            result.confidence_level = conf.level;
            result.severity_color = conf.color;

            diagnosisCache[cacheKey] = {
                timestamp: Date.now(),
                data: result
            };
            return result;
        } catch (error) {
            console.error("Gemini API Error:", error.message || error);
        }
    }

    return buildFallbackResponse(lang);
}

// ─── Chatbot: free-form agriculture Q&A ───────────────────────────────────────

const CHATBOT_SYSTEM_PROMPT = `You are Krishi Cure AI Agriculture Assistant. Answer only agriculture and farming related questions. Use simple farmer-friendly language. Give practical and accurate advice. Prefer information based on government agriculture recommendations, agricultural universities, KVK guidance, ICAR practices, and standard agriculture references. Avoid difficult technical language. If unsure, clearly state limitations instead of guessing. Keep answers concise and practical. Use numbered steps when giving instructions. Never generate harmful farming advice. Never make up facts. If a question is not related to agriculture or farming, politely decline to answer and explain that you can only help with farming topics.`;

const langNames = { en: 'English', hi: 'Hindi', gu: 'Gujarati' };

export async function chatWithAI(question, lang = 'en', history = []) {
    const systemPrompt = `${CHATBOT_SYSTEM_PROMPT}\n\nIMPORTANT: Always respond in ${langNames[lang] || 'English'}. Use simple, farmer-friendly words in that language.`;

    const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: question }
    ];

    if (process.env.GROQ_API_KEY) {
        try {
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
            const completion = await groq.chat.completions.create({
                messages,
                model: 'llama-3.3-70b-versatile',
                max_tokens: 512,
                temperature: 0.4
            });
            const result = completion.choices[0].message.content;
            return { success: true, reply: result, provider: 'groq' };
        } catch (error) {
            console.warn("Groq Chat Error, falling back to Gemini:", error.message || error);
        }
    }

    if (process.env.GEMINI_API_KEY) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: question,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.4
                }
            });
            return { success: true, reply: response.text, provider: 'gemini' };
        } catch (error) {
            console.error("Gemini Chat Error:", error.message || error);
        }
    }

    const errorMsg = {
        en: 'Sorry, the AI service is temporarily unavailable. Please try again in a few minutes.',
        hi: 'क्षमा करें, AI सेवा अभी उपलब्ध नहीं है। कृपया कुछ मिनट बाद पुनः प्रयास करें।',
        gu: 'માફ કરશો, AI સેવા હાલ ઉપલબ્ધ નથી. કૃપા કરીને થોડી મિનિટ પછી ફરી પ્રયાસ કરો।'
    };
    return {
        success: false,
        reply: errorMsg[lang] || errorMsg.en,
        provider: 'none'
    };
}

export async function diagnoseImageWithAI(cropName, images, symptoms, lang) {
    const systemInstruction = `You are an elite Agricultural Scientist and Multimodal Plant Pathologist from ICAR (Indian Council of Agricultural Research) helping rural, uneducated farmers.
Provide highly accurate image-based crop disease diagnosis using extremely simple, clear, everyday conversational language in the requested language.
Analyze all provided images of the plant together. Cross-check observations between multiple images (e.g. full plant view, close-up of leaf/stem/fruit) before generating results.
Identify crop diseases, pest infestations, nutrient deficiencies, environmental stress, or water-related issues.
Avoid any complex scientific, technical, or academic terms. Use only common local words that a rural farmer understands.

Accuracy Rules:
1. Prioritize accuracy over speed. Do not guess when confidence is low.
2. If the provided images are unclear, blurry, do not show a plant, or are irrelevant, set "confidence_score" to under 30 (or 0) and explain in the "disease_explanation" that the images are not clear, asking the user to upload well-lit, close-up photos of the affected plant parts.
3. Do not generate diseases that are not visible. Do not provide false certainty.
4. If confidence is low, recommend field inspection or adding more symptoms.
5. If multiple diseases are possible, show the top possibilities in the "top_diseases" array and explain the reasoning.`;

    const taskPrompt = `Task: Carefully analyze the provided plant images for "${cropName}".
${symptoms && symptoms.length > 0 ? `Additional context - Farmer reported these manual symptoms: ${symptoms.join(", ")}` : "No manual symptoms reported."}

Language Requested: ${lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English'}

Output Requirement: You MUST respond ONLY with a valid JSON object (no markdown, no code blocks).
Ensure the diagnosis is scientifically accurate based on the images, but translate the language into extremely simple, colloquial words.

CRITICAL LANGUAGE INSTRUCTIONS - Use very easy, everyday words:
- NEVER use heavy traditional names like "Jivamrut", "Bijamrut", "Amritpani". Instead, use terms like "cow dung and urine mixture", "neem spray", "homemade mixture".
- In Gujarati:
  * Avoid words like "દ્રાવણ" (solution), "સારવાર" (treatment), "નિયમિત" (regular), "અટકાવ" (prevention).
  * Use "મિશ્રણ" (mixture), "દવા" (medicine), "ઉપાય" (solution/cure), "નિયમ પ્રમાણે" (regularly/properly), "બચાવ" (prevention/save), "મૂળિયાં" (roots).
- In Hindi:
  * Avoid heavy Sanskritized or formal words. Use simple colloquial terms.

Format of the JSON object:
{
    "disease_name": "Common local name of the primary disease/issue in the requested language (extremely simple)",
    "confidence_level": "High" | "Medium" | "Low",
    "confidence_score": 85, // integer percentage based on visual evidence
    "crop_health_score": 80, // overall health percentage (0-100)
    "risk_level": "High" | "Medium" | "Low",
    "yield_impact": "High" | "Medium" | "Low", // predicted impact on harvest
    "severity_color": "Red" | "Yellow" | "Green",
    "disease_explanation": "Explain why this diagnosis was made based on what you see in the images, using simple farmer-friendly language.",
    "observed_symptoms": "Simple, clear description of the symptoms observed in the images (in requested language)",
    "possible_causes": "Simple explanation of what causes this disease/issue (in requested language)",
    "recovery_details": {
        "chances": "High" | "Medium" | "Low",
        "time": "e.g., 7-10 days (in requested language)",
        "unrecoverable_signs": "1 simple warning sign showing when the crop cannot be saved anymore"
    },
    "organic_treatment": [
        "Step 1: Preparation (1 very simple, short sentence on how to make the remedy in conversational language)",
        "Step 2: Application (1 very simple, short sentence on how to put it on the plant in conversational language)",
        "Step 3: Prevention/Take Care (1 very simple, short sentence on what to do next to save the plant)"
    ],
    "chemical_treatment": [
        "Step 1: Emergency Chemical (1 simple sentence on safe chemical control like Copper Oxychloride spray in requested language)",
        "Step 2: Safety Rule (1 simple safety rule when spraying)"
    ],
    "prevention_methods": [
        "Prevention 1 (1 simple prevention step in requested language)",
        "Prevention 2 (1 simple prevention step in requested language)"
    ],
    "fertilizer_suggestions": "Simple, everyday advice on fertilizers or compost in requested language",
    "irrigation_recommendations": "Simple watering advice (e.g. how much water to give now) in requested language",
    "weather_precautions": "Simple weather-related advice for the crop in requested language",
    "early_warning_signs": "Simple early signs to watch out for in requested language",
    "nearest_action": "Simple action step to contact local extension officer or KVK in requested language",
    "top_diseases": [
        { "name": "Primary predicted disease name in requested language", "confidence": 85 },
        { "name": "Second possible disease name in requested language", "confidence": 55 },
        { "name": "Third possible disease name in requested language", "confidence": 30 }
    ]
}

All array sentences must be under 12 words. Make sure all values are translated to the requested language.`;

    if (process.env.GEMINI_API_KEY) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            
            const contents = [];
            for (const img of images) {
                const cleanBase64 = img.base64Data.split(';base64,').pop();
                contents.push({
                    inlineData: {
                        data: cleanBase64,
                        mimeType: img.mimeType || 'image/jpeg'
                    }
                });
            }
            contents.push(taskPrompt);

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    temperature: 0.2
                }
            });

            const jsonText = response.text;
            const result = JSON.parse(jsonText);

            const conf = classifyConfidence(result.confidence_score);
            result.confidence_level = conf.level;
            result.severity_color = conf.color;

            return result;
        } catch (error) {
            console.error("Gemini Image Diagnosis API Error:", error.message || error);
        }
    } else {
        console.warn("GEMINI_API_KEY not configured in backend.");
    }

    return buildFallbackResponse(lang);
}
