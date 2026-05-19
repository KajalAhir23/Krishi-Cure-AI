import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

const diagnosisCache = {};

export async function diagnoseWithAI(cropName, symptoms, cropProfile, lang) {
    const cacheKey = `${cropName}_${symptoms.sort().join(',')}_${lang}`;
    if (diagnosisCache[cacheKey]) {
        return diagnosisCache[cacheKey];
    }

    const systemInstruction = `You are an elite Agricultural Scientist from ICAR (Indian Council of Agricultural Research) helping rural, uneducated farmers.
Provide highly accurate symptom-based crop disease diagnosis using extremely simple, clear, everyday conversational language.
Avoid any complex scientific, technical, or academic terms. Use only common local words that a rural farmer understands.`;

    const taskPrompt = `Task: Carefully analyze these symptoms for ${cropName} and accurately identify the top 3 possible diseases, pests, or deficiencies.
Symptoms: ${symptoms.join(", ")}
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

    // 1. Try Gemini first
    if (process.env.GEMINI_API_KEY) {
        try {
            console.log("Attempting diagnosis with Gemini API...");
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
            
            // Cache the result
            diagnosisCache[cacheKey] = result;
            return result;
        } catch (error) {
            console.warn("Gemini API Error, checking for Groq fallback:", error.message || error);
        }
    }

    // 2. Try Groq as a fallback
    if (process.env.GROQ_API_KEY) {
        try {
            console.log("Attempting diagnosis with Groq API (llama-3.3-70b-versatile)...");
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

            // Cache the result
            diagnosisCache[cacheKey] = result;
            return result;
        } catch (groqError) {
            console.error("Groq API Error:", groqError.message || groqError);
        }
    }

    // 3. Fallback response in case both APIs fail
    const isGu = lang === 'gu';
    const isHi = lang === 'hi';
    return {
        disease_name: isGu ? "અજ્ઞાત સમસ્યા" : isHi ? "अज्ञात समस्या" : "Unknown Issue",
        confidence_score: 0,
        severity_color: "Yellow",
        disease_explanation: isGu ? "તમારા પાકમાં કોઈ અજ્ઞાત રોગ જોવા મળ્યો છે." : isHi ? "आपकी फसल में कोई अज्ञात बीमारी देखी गई है।" : "An unknown issue was detected on your crop.",
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
