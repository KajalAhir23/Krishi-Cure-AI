import fs from 'fs/promises';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: '../.env' });

async function run() {
    console.log("Starting data processing...");
    const rawData = await fs.readFile('./raw.txt', 'utf8');
    const cropsJson = JSON.parse(await fs.readFile('../data/crops.json', 'utf8'));

    const lines = rawData.split('\n').map(l => l.trim()).filter(l => l);
    
    let currentCrop = null;
    const cropSymptomsMap = {};
    const uniqueSymptoms = new Set();
    
    for (const line of lines) {
        if (line.toLowerCase().includes('and its symptoms')) {
            const parts = line.split(':');
            if (parts.length > 1) {
                currentCrop = parts[1].split('(')[0].split('/')[0].trim().toLowerCase();
                cropSymptomsMap[currentCrop] = [];
            }
        } else if (line.includes('(') && !line.includes('Symptoms:')) {
            currentCrop = line.split('/')[0].split('(')[0].trim().toLowerCase();
            cropSymptomsMap[currentCrop] = [];
        } else if (line.toLowerCase() === 'symptoms:') {
            continue;
        } else {
            if (currentCrop) {
                cropSymptomsMap[currentCrop].push(line);
                uniqueSymptoms.add(line);
            }
        }
    }

    console.log("Parsed Crops:", Object.keys(cropSymptomsMap));
    console.log(`Found ${uniqueSymptoms.size} unique symptoms.`);

    // Find existing symptoms to avoid re-translation
    const existingSymptomsMap = {};
    for (const sym of cropsJson.symptomsList) {
        existingSymptomsMap[sym.en.toLowerCase()] = sym;
    }

    const symptomsToTranslate = [];
    for (const sym of uniqueSymptoms) {
        // try to find by exact match
        let found = existingSymptomsMap[sym.toLowerCase()];
        if (!found) {
            symptomsToTranslate.push(sym);
        }
    }

    console.log(`${symptomsToTranslate.length} symptoms need translation.`);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // We might need to chunk translations if too many
    const translatedSymptoms = [];
    
    if (symptomsToTranslate.length > 0) {
        const chunkSize = 50;
        for (let i = 0; i < symptomsToTranslate.length; i += chunkSize) {
            const chunk = symptomsToTranslate.slice(i, i + chunkSize);
            console.log(`Translating chunk ${i/chunkSize + 1}...`);
            
            const prompt = `Translate the following English agricultural symptoms into accurate Hindi and Gujarati. 
Return ONLY a raw JSON array of objects.
Format:
[
  { "en": "Symptom Name", "hi": "हिंदी अनुवाद", "gu": "ગુજરાતી અનુવાદ" }
]

Symptoms to translate:
${JSON.stringify(chunk)}`;

            let response;
            let retries = 3;
            while (retries > 0) {
                try {
                    response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                        config: {
                            responseMimeType: "application/json",
                            temperature: 0.1
                        }
                    });
                    break;
                } catch (err) {
                    if (err.status === 503) {
                        console.log("503 error, retrying in 5 seconds...");
                        await new Promise(r => setTimeout(r, 5000));
                        retries--;
                    } else {
                        throw err;
                    }
                }
            }
            if (!response) {
                console.error("Max retries reached for chunk, skipping...");
                continue;
            }

            try {
                const parsed = JSON.parse(response.text);
                translatedSymptoms.push(...parsed);
            } catch (e) {
                console.error("Failed to parse AI response:", response.text);
            }
        }
    }

    // Merge translated symptoms into cropsJson.symptomsList
    let nextId = cropsJson.symptomsList.length + 1;
    for (const ts of translatedSymptoms) {
        const idStr = "sym_" + nextId++;
        const newSym = {
            id: idStr,
            category: "leaf", // default fallback, could be improved
            en: ts.en,
            hi: ts.hi,
            gu: ts.gu
        };
        
        // basic categorization heuristic
        const lowerEn = ts.en.toLowerCase();
        if (lowerEn.includes('root') || lowerEn.includes('tuber') || lowerEn.includes('soil')) newSym.category = 'root';
        else if (lowerEn.includes('stem') || lowerEn.includes('branch') || lowerEn.includes('twig') || lowerEn.includes('bark') || lowerEn.includes('trunk')) newSym.category = 'stem';
        else if (lowerEn.includes('fruit') || lowerEn.includes('pod') || lowerEn.includes('seed') || lowerEn.includes('flower') || lowerEn.includes('boll') || lowerEn.includes('cob')) newSym.category = 'fruit';

        cropsJson.symptomsList.push(newSym);
        existingSymptomsMap[ts.en.toLowerCase()] = newSym;
    }

    // Map symptoms back to crops
    let matchedCropsCount = 0;
    for (const cat in cropsJson.cropsList) {
        for (const crop of cropsJson.cropsList[cat]) {
            // Find the best match in cropSymptomsMap
            let bestMatchKey = null;
            
            const possibleNames = [
                crop.en.toLowerCase(), 
                crop.en.split('(')[0].split('/')[0].trim().toLowerCase()
            ];

            for (const name of possibleNames) {
                if (cropSymptomsMap[name]) {
                    bestMatchKey = name;
                    break;
                }
                // Try finding if a key contains the name
                const matchedKey = Object.keys(cropSymptomsMap).find(k => k.includes(name) || name.includes(k));
                if (matchedKey) {
                    bestMatchKey = matchedKey;
                    break;
                }
            }

            if (bestMatchKey) {
                matchedCropsCount++;
                const symStrings = cropSymptomsMap[bestMatchKey];
                crop.symptoms = [];
                for (const symStr of symStrings) {
                    const mapped = existingSymptomsMap[symStr.toLowerCase()];
                    if (mapped) {
                        crop.symptoms.push(mapped.id);
                    }
                }
            }
        }
    }

    console.log(`Matched ${matchedCropsCount} crops with symptom data.`);

    await fs.writeFile('../data/crops.json', JSON.stringify(cropsJson, null, 2), 'utf8');
    console.log("data/crops.json has been successfully updated!");
}

run().catch(console.error);
