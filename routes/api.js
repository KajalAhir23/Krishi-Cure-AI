import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { diagnoseWithAI, chatWithAI, diagnoseImageWithAI } from '../controllers/aiController.js';
import { calculateFertilizer } from '../controllers/fertilizerController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Load crops data dynamically
const cropsDataPath = path.join(__dirname, '../data/crops.json');
let cropsData = null;

async function getCropsData() {
    if (cropsData) return cropsData;
    try {
        const data = await fs.readFile(cropsDataPath, 'utf8');
        cropsData = JSON.parse(data);
        return cropsData;
    } catch (e) {
        console.error("Error loading crops.json", e);
        return null;
    }
}

// Pre-load on startup
getCropsData().catch(err => console.error("Initial load of crops data failed:", err));

// Validation Middlewares
function validateDiagnose(req, res, next) {
    const { cropId, symptoms } = req.body;
    if (!cropId) return res.status(400).json({ error: "Missing cropId" });
    if (!symptoms || (Array.isArray(symptoms) && symptoms.length === 0)) {
        return res.status(400).json({ error: "Missing symptoms" });
    }
    next();
}

function validateDiagnoseImage(req, res, next) {
    const { cropId, images } = req.body;
    if (!cropId) return res.status(400).json({ error: "Missing cropId" });
    if (!images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ error: "Missing or invalid images" });
    }
    next();
}

function validateChatbot(req, res, next) {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || question.trim() === '') {
        return res.status(400).json({ error: "Question is required." });
    }
    next();
}

function validateFertilizer(req, res, next) {
    const { cropId, fertilizerId, areaUnit, areaValue } = req.body;
    if (!cropId) return res.status(400).json({ error: "Missing cropId" });
    if (!fertilizerId) return res.status(400).json({ error: "Missing fertilizerId" });
    if (!areaUnit) return res.status(400).json({ error: "Missing areaUnit" });
    if (areaValue === undefined || isNaN(parseFloat(areaValue)) || parseFloat(areaValue) <= 0) {
        return res.status(400).json({ error: "Invalid areaValue" });
    }
    next();
}

// Endpoint to fetch master data for the frontend
router.get('/data', async (req, res) => {
    const data = await getCropsData();
    if (!data) {
        return res.status(500).json({ error: "Failed to load master crops data." });
    }
    res.json({
        cropsList: data.cropsList,
        symptomsList: data.symptomsList,
        langStore: data.langStore
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
router.post('/diagnose', validateDiagnose, async (req, res) => {
    try {
        const data = await getCropsData();
        if (!data) {
            return res.status(500).json({ error: "Failed to load master crops data." });
        }

        const { cropId, symptoms, lang } = req.body;
        const selectedSymptoms = Array.isArray(symptoms) ? symptoms : [symptoms];
        const selectedLang = lang || 'en';
        
        let cropName = "Unknown Crop";
        for (const cat in data.cropsList) {
            const crop = data.cropsList[cat].find(c => c.id === cropId);
            if (crop) {
                cropName = crop[selectedLang] || crop['en'];
                break;
            }
        }

        const symptomDescriptions = selectedSymptoms.map(symId => {
            const symptom = data.symptomsList.find(s => s.id === symId);
            return symptom ? (symptom[selectedLang] || symptom['en']) : symId;
        });

        const cropProfile = data.cropProfiles[cropId] || null;
        const aiResponse = await diagnoseWithAI(cropName, symptomDescriptions, cropProfile, selectedLang);
        res.json(aiResponse);
    } catch (error) {
        console.error("Diagnosis error:", error);
        res.status(500).json({ error: "Error generating diagnosis." });
    }
});

// Endpoint for image-based diagnosis
router.post('/diagnose-image', validateDiagnoseImage, async (req, res) => {
    try {
        const data = await getCropsData();
        if (!data) {
            return res.status(500).json({ error: "Failed to load master crops data." });
        }

        const { cropId, images, symptoms, lang } = req.body;
        const selectedLang = lang || 'en';

        let cropName = "Unknown Crop";
        for (const cat in data.cropsList) {
            const crop = data.cropsList[cat].find(c => c.id === cropId);
            if (crop) {
                cropName = crop[selectedLang] || crop['en'];
                break;
            }
        }

        let symptomDescriptions = [];
        if (symptoms && symptoms.length > 0) {
            const selectedSymptoms = Array.isArray(symptoms) ? symptoms : [symptoms];
            symptomDescriptions = selectedSymptoms.map(symId => {
                const symptom = data.symptomsList.find(s => s.id === symId);
                return symptom ? (symptom[selectedLang] || symptom['en']) : symId;
            });
        }

        const aiResponse = await diagnoseImageWithAI(cropName, images, symptomDescriptions, selectedLang);
        res.json(aiResponse);
    } catch (error) {
        console.error("Image diagnosis error:", error);
        res.status(500).json({ error: "Error generating image diagnosis." });
    }
});

// Endpoint for general agriculture Q&A chatbot
router.post('/chatbot', validateChatbot, async (req, res) => {
    try {
        const { question, lang, history } = req.body;
        const selectedLang = lang || 'en';
        const conversationHistory = history || [];

        const aiResponse = await chatWithAI(question, selectedLang, conversationHistory);
        res.json(aiResponse);
    } catch (error) {
        console.error("Chatbot error:", error);
        res.status(500).json({ error: "Error processing chat message." });
    }
});

// Endpoint for fertilizer calculation
router.post('/fertilizer/calculate', validateFertilizer, (req, res) => {
    try {
        const { cropId, fertilizerId, areaUnit, areaValue, lang } = req.body;
        const result = calculateFertilizer(cropId, fertilizerId, areaUnit, areaValue, lang);
        res.json(result);
    } catch (error) {
        console.error("Fertilizer calculate route error:", error);
        res.status(500).json({ error: "Error calculating fertilizer requirements." });
    }
});

// Helper: create an AbortSignal that times out after ms
function fetchWithTimeout(url, options = {}, ms = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timer));
}

// Helper: reverse geocode a lat/lon to a localized city name via Nominatim (server-side)
async function reverseGeocodeBackend(lat, lon, lang) {
    const langChainMap = {
        en: 'en',
        hi: 'hi,en',
        gu: 'gu,hi,en'
    };
    const nominatimLang = langChainMap[lang] || 'en';
    try {
        const geoRes = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=${encodeURIComponent(nominatimLang)}`,
            { headers: { 'User-Agent': 'Krishi-Cure-AI-App', 'Accept-Language': nominatimLang } }
        );
        if (!geoRes.ok) return '';
        const geoData = await geoRes.json();
        return geoData.address?.village ||
               geoData.address?.town    ||
               geoData.address?.city    ||
               geoData.address?.county  ||
               geoData.address?.state   || '';
    } catch {
        return '';
    }
}

// /api/geocode — Forward geocode via Nominatim
router.get('/geocode', async (req, res) => {
    const { q, lang } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing city query parameter' });

    const langChainMap = { en: 'en', hi: 'hi,en', gu: 'gu,hi,en' };
    const nominatimLang = langChainMap[lang] || 'en';
    const owmLang = lang || 'en';

    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=${encodeURIComponent(nominatimLang)}&addressdetails=1`;
        const response = await fetchWithTimeout(url, {
            headers: {
                'User-Agent': 'Krishi-Cure-AI-App',
                'Accept-Language': nominatimLang
            }
        });
        if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);
        const data = await response.json();

        const results = data.map(item => ({
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            display_name: item.display_name,
            name: item.address?.village || item.address?.town || item.address?.city || item.name || '',
            localName: item.name || ''
        }));

        return res.json(results);
    } catch (err) {
        console.warn('Geocoding (Nominatim) warning, trying OWM:', err.message);
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Failed to geocode location' });
        }
        try {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`;
            const response = await fetchWithTimeout(url);
            if (!response.ok) throw new Error(`OWM Geocoding error: ${response.status}`);
            const data = await response.json();
            const results = data.map(item => ({
                lat: item.lat, lon: item.lon,
                display_name: `${item.name}, ${item.country}`,
                name: item.name, localName: item.local_names?.[owmLang] || item.name
            }));
            return res.json(results);
        } catch (fallbackErr) {
            console.error('Geocoding fallback also failed:', fallbackErr);
            return res.status(500).json({ error: 'Failed to geocode location' });
        }
    }
});

// /api/weather — Proxy weather with localized city name
router.get('/weather', async (req, res) => {
    const { lat, lon, lang } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "Missing lat or lon query parameters" });
    }

    const owmLang = (lang === 'hi') ? 'hi' : 'en';
    const apiKey = process.env.WEATHER_API_KEY;

    if (apiKey) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${owmLang}`;
            const response = await fetchWithTimeout(url);

            if (response.ok) {
                const data = await response.json();
                const localizedCity = await reverseGeocodeBackend(lat, lon, lang || 'en');
                if (localizedCity) {
                    data.city = data.city || {};
                    data.city.name = localizedCity;
                }
                return res.json(data);
            }
        } catch (err) {
            console.warn("OpenWeatherMap fetch failed, falling back to Open-Meteo:", err.message);
        }
    }

    try {
        const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=precipitation_probability_max&timezone=auto`;
        const omRes = await fetchWithTimeout(openMeteoUrl);
        if (!omRes.ok) throw new Error("Open-Meteo API returned error status");
        const omData = await omRes.json();

        let cityName = await reverseGeocodeBackend(lat, lon, lang || 'en');
        if (!cityName && Math.abs(lat - 22.5644) < 0.1 && Math.abs(lon - 72.9289) < 0.1) {
            const fallbackNames = { en: 'Anand', hi: 'आणंद', gu: 'આણંદ' };
            cityName = fallbackNames[lang] || 'Anand';
        }

        const mapWmoToOwm = (code) => {
            if (code === 0) return 800;
            if (code >= 1 && code <= 3) return 802;
            if (code === 45 || code === 48) return 741;
            if (code >= 51 && code <= 57) return 300;
            if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 500;
            if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 600;
            if (code >= 95 && code <= 99) return 211;
            return 800;
        };

        const pop = (omData.daily.precipitation_probability_max[0] ?? 0) / 100;
        const mappedCode = mapWmoToOwm(omData.current.weather_code);

        const adaptedData = {
            list: [{
                main: {
                    temp: omData.current.temperature_2m,
                    humidity: omData.current.relative_humidity_2m
                },
                weather: [{ id: mappedCode }],
                wind: { speed: omData.current.wind_speed_10m / 3.6 },
                pop
            }],
            city: { name: cityName }
        };

        return res.json(adaptedData);
    } catch (fallbackErr) {
        console.error("Both OpenWeatherMap and Open-Meteo failed:", fallbackErr);
        return res.status(500).json({ error: "Failed to fetch weather forecast from all sources" });
    }
});

export default router;
