import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { diagnoseWithAI } from '../controllers/aiController.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Load crops data dynamically
const cropsDataPath = path.join(__dirname, '../data/crops.json');
async function getCropsData() {
    try {
        const data = await fs.readFile(cropsDataPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Error loading crops.json", e);
        return null;
    }
}

// Endpoint to fetch master data for the frontend
router.get('/data', async (req, res) => {
    const cropsData = await getCropsData();
    if (!cropsData) {
        return res.status(500).json({ error: "Failed to load master crops data." });
    }
    res.json({
        cropsList: cropsData.cropsList,
        symptomsList: cropsData.symptomsList,
        langStore: cropsData.langStore
    });
});

// Endpoint to fetch Firebase config for the client safely from environment variables
router.get('/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY || "AIzaSyPlaceholderKey-ChangeMe",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "krishi-cure-ai.firebaseapp.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "krishi-cure-ai",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "krishi-cure-ai.appspot.com",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1234567890",
        appId: process.env.FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
    });
});

// Endpoint for diagnosis
router.post('/diagnose', async (req, res) => {
    try {
        const cropsData = await getCropsData();
        if (!cropsData) {
            return res.status(500).json({ error: "Failed to load master crops data." });
        }

        const { cropId, symptoms, lang } = req.body;

        if (!cropId || !symptoms || symptoms.length === 0) {
            return res.status(400).json({ error: "Missing cropId or symptoms" });
        }

        const selectedSymptoms = Array.isArray(symptoms) ? symptoms : [symptoms];
        const selectedLang = lang || 'en';
        
        // Find crop name
        let cropName = "Unknown Crop";
        for (const cat in cropsData.cropsList) {
            const crop = cropsData.cropsList[cat].find(c => c.id === cropId);
            if (crop) {
                cropName = crop[selectedLang] || crop['en'];
                break;
            }
        }

        // Generate symptom descriptions in selected language
        const symptomDescriptions = selectedSymptoms.map(symId => {
            const symptom = cropsData.symptomsList.find(s => s.id === symId);
            return symptom ? (symptom[selectedLang] || symptom['en']) : symId;
        });

        // Retrieve crop profile if available for AI context
        const cropProfile = cropsData.cropProfiles[cropId] || null;

        // Direct AI diagnosis (trusted sources via Gemini/Groq)
        const aiResponse = await diagnoseWithAI(cropName, symptomDescriptions, cropProfile, selectedLang);
        res.json(aiResponse);
    } catch (error) {
        console.error("Diagnosis error:", error);
        res.status(500).json({ error: "Error generating diagnosis." });
    }
});

export default router;
