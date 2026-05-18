import { GoogleGenAI } from '@google/genai';

const diagnosisCache = {};

export async function diagnoseWithAI(cropName, symptoms, cropProfile, lang) {
    const cacheKey = `${cropName}_${symptoms.sort().join(',')}_${lang}`;
    if (diagnosisCache[cacheKey]) {
        return diagnosisCache[cacheKey];
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are an elite, highly accurate Agricultural Scientist from Gujarat, but you speak like a friendly local farmer.`;

    const taskPrompt = `Task: Carefully analyze these symptoms for ${cropName} and accurately identify the exact disease, pest, or deficiency.
Symptoms: ${symptoms.join(", ")}
Language Requested: ${lang === 'hi' ? 'Hindi' : lang === 'gu' ? 'Gujarati' : 'English'}

Output Requirement: You MUST respond ONLY with a valid JSON object (no markdown formatting, no code blocks, just raw JSON).
1. Your diagnosis MUST be 100% scientifically accurate based on the symptoms.
2. Keep your answers VERY SHORT and use EXTREMELY SIMPLE, EVERYDAY language that an uneducated farmer can easily understand. Avoid hard scientific words in the remedy steps.

{
    "disease_name": "Common local name of the disease in the requested language",
    "confidence_score": 85,
    "severity_color": "Red" | "Yellow" | "Green",
    "organic_remedy": [
        "Step 1: Preparation (1 very short, simple sentence on making an accurate organic solution like Jivamrut or Neem oil)",
        "Step 2: Application (1 very short, simple sentence on how to use it accurately)",
        "Step 3: Prevention (1 very short, simple sentence on what to do next)"
    ]
}
The organic_remedy array must have exactly 3 very simple, short sentences in the requested language. Short answers will make the app fast.`;

    try {
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
        
        // Cache the result for immediate future responses
        diagnosisCache[cacheKey] = result;
        return result;
    } catch (error) {
        console.error("AI Gen Error:", error);
        // Fallback response in case of API failure
        return {
            disease_name: lang === 'gu' ? "અજ્ઞાત સમસ્યા" : lang === 'hi' ? "अज्ञात समस्या" : "Unknown Issue",
            confidence_score: 0,
            severity_color: "Yellow",
            organic_remedy: [
                lang === 'gu' ? "કૃષિ નિષ્ણાતની સલાહ લો." : lang === 'hi' ? "कृषि विशेषज्ञ से सलाह लें।" : "Consult an agricultural expert.",
                lang === 'gu' ? "જમીનની ચકાસણી કરાવો." : lang === 'hi' ? "मिट्टी का परीक्षण कराएं।" : "Test your soil.",
                lang === 'gu' ? "યોગ્ય ભેજ જાળવી રાખો." : lang === 'hi' ? "उचित नमी बनाए रखें।" : "Maintain proper moisture."
            ]
        };
    }
}
