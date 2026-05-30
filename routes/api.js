import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { diagnoseWithAI, chatWithAI } from '../controllers/aiController.js';


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

// Endpoint for general agriculture Q&A chatbot
router.post('/chatbot', async (req, res) => {
    try {
        const { question, lang, history } = req.body;
        if (!question) {
            return res.status(400).json({ error: "Question is required." });
        }
        const selectedLang = lang || 'en';
        const conversationHistory = history || [];

        const aiResponse = await chatWithAI(question, selectedLang, conversationHistory);
        res.json(aiResponse);
    } catch (error) {
        console.error("Chatbot error:", error);
        res.status(500).json({ error: "Error processing chat message." });
    }
});

// ── Helper: create an AbortSignal that times out after `ms` milliseconds ──
function fetchWithTimeout(url, options = {}, ms = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timer));
}

// ── Helper: reverse geocode a lat/lon to a localized city name via Nominatim (server-side, no CORS) ──
async function reverseGeocodeBackend(lat, lon, lang) {
    // Use a priority language chain: if localized name isn't available in OSM data,
    // Nominatim will fall back to the next language in the list.
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

// ── /api/geocode — Forward geocode (text search) via Nominatim (proxied to avoid CORS) ──
router.get('/geocode', async (req, res) => {
    const { q, lang } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing city query parameter' });

    // Use a priority language chain so results show in best available script
    const langChainMap = { en: 'en', hi: 'hi,en', gu: 'gu,hi,en' };
    const nominatimLang = langChainMap[lang] || 'en';
    // Short lang code for OWM fallback (only supports 2-letter codes)
    const owmLang = lang || 'en';

    try {
        // Nominatim search with language support — free, no API key needed
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=${encodeURIComponent(nominatimLang)}&addressdetails=1`;
        const response = await fetchWithTimeout(url, {
            headers: {
                'User-Agent': 'Krishi-Cure-AI-App',
                'Accept-Language': nominatimLang
            }
        });
        if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);
        const data = await response.json();

        // Map to a simple { lat, lon, display_name, name, localName } format
        const results = data.map(item => ({
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            display_name: item.display_name,
            name: item.address?.village || item.address?.town || item.address?.city || item.name || '',
            localName: item.name || ''
        }));

        return res.json(results);

    } catch (err) {
        console.error('Geocoding (Nominatim) error:', err);
        // Fallback: try OpenWeatherMap geocoding (only if WEATHER_API_KEY is configured)
        const apiKey = process.env.WEATHER_API_KEY;
        if (!apiKey) {
            console.warn('WEATHER_API_KEY not set — skipping OWM geocode fallback.');
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

// ── /api/weather — Proxy weather with localized city name (server-side reverse geocode) ──
router.get('/weather', async (req, res) => {
    const { lat, lon, lang } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "Missing lat or lon query parameters" });
    }

    // OWM only supports 2-letter lang codes; city name is always overridden by Nominatim anyway
    const owmLang = (lang === 'hi') ? 'hi' : 'en';
    const apiKey = process.env.WEATHER_API_KEY;

    // Try OpenWeatherMap first (only if API key is configured)
    if (apiKey) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${owmLang}`;
            const response = await fetchWithTimeout(url);

            if (response.ok) {
                const data = await response.json();
                // Override city name with localized version from Nominatim (server-side)
                const localizedCity = await reverseGeocodeBackend(lat, lon, lang || 'en');
                if (localizedCity) {
                    data.city = data.city || {};
                    data.city.name = localizedCity;
                }
                return res.json(data);
            }
            console.warn(`OpenWeather API returned error status ${response.status}. Falling back to Open-Meteo.`);
        } catch (err) {
            console.warn("OpenWeatherMap fetch failed, falling back to Open-Meteo:", err);
        }
    } else {
        console.warn('WEATHER_API_KEY not set — using Open-Meteo (free fallback) directly.');
    }

    // Fallback: Open-Meteo (completely free, no API key)
    try {
        const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=precipitation_probability_max&timezone=auto`;
        const omRes = await fetchWithTimeout(openMeteoUrl);
        if (!omRes.ok) throw new Error("Open-Meteo API returned error status");
        const omData = await omRes.json();

        // Localized city name via Nominatim (server-side — no CORS)
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
