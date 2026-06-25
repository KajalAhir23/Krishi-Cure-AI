/**
 * API Routes - Refactored
 * Professional API endpoint definitions
 */

import express from 'express';
import { getMasterDataController, getFirebaseConfigController } from '../controllers/dataController.js';
import { diagnoseBySymptomsController, diagnoseByImageController } from '../controllers/diagnosisController.js';
import { chatbotController } from '../controllers/chatbotController.js';
import { calculateFertilizerController } from '../controllers/fertilizerController.js';
import { ENV } from '../config/environment.js';
import {
  validateDiagnosis,
  validateImageDiagnosis,
  validateChatbot,
  validateFertilizer
} from '../utils/validationMiddleware.js';

const router = express.Router();

/**
 * Data Endpoints
 */

/**
 * GET /api/data
 * Returns master data: crops list, symptoms, and translations
 */
router.get('/data', getMasterDataController);

/**
 * GET /api/firebase-config
 * Returns Firebase configuration for client-side authentication
 */
router.get('/firebase-config', getFirebaseConfigController);

/**
 * Diagnosis Endpoints
 */

/**
 * POST /api/diagnose
 * Symptom-based disease diagnosis
 *
 * Request Body:
 * {
 *   "cropId": "wheat",
 *   "symptoms": ["symptom1", "symptom2"],
 *   "lang": "en"
 * }
 */
router.post('/diagnose', validateDiagnosis, diagnoseBySymptomsController);

/**
 * POST /api/diagnose-image
 * Image-based disease diagnosis
 *
 * Request Body:
 * {
 *   "cropId": "wheat",
 *   "images": ["base64_image_1", "base64_image_2"],
 *   "symptoms": ["symptom1"],
 *   "lang": "en"
 * }
 */
router.post('/diagnose-image', validateImageDiagnosis, diagnoseByImageController);

/**
 * Chatbot Endpoint
 */

/**
 * POST /api/chatbot
 * General agriculture Q&A chatbot
 *
 * Request Body:
 * {
 *   "question": "How to grow wheat?",
 *   "lang": "en",
 *   "history": []
 * }
 */
router.post('/chatbot', validateChatbot, chatbotController);

/**
 * Fertilizer Endpoint
 */

/**
 * POST /api/fertilizer/calculate
 * Calculate fertilizer requirements
 *
 * Request Body:
 * {
 *   "cropId": "wheat",
 *   "fertilizerId": "urea",
 *   "areaUnit": "Acre",
 *   "areaValue": 5,
 *   "lang": "en"
 * }
 */
router.post('/fertilizer/calculate', validateFertilizer, calculateFertilizerController);

/**
 * Weather Endpoints
 */

/**
 * GET /api/geocode?lat=xx&lon=yy
 * Reverse geocoding: returns city name from coordinates using Nominatim
 */
function mapWmoToOwmCode(wmoCode) {
  if (wmoCode === 0) return 800; // Clear
  if (wmoCode >= 1 && wmoCode <= 3) return 801 + (wmoCode - 1); // Cloudy
  if (wmoCode === 45 || wmoCode === 48) return 741; // Fog
  if (wmoCode >= 51 && wmoCode <= 55) return 300; // Drizzle
  if (wmoCode >= 61 && wmoCode <= 65) return 500; // Rain
  if (wmoCode >= 71 && wmoCode <= 75) return 600; // Snow
  if (wmoCode >= 80 && wmoCode <= 82) return 521; // Showers
  if (wmoCode >= 95 && wmoCode <= 99) return 200; // Thunderstorm
  return 800;
}

router.get('/geocode', async (req, res) => {
  const { lat, lon, q } = req.query;

  if (q) {
    // Forward geocoding search
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });
      if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error('[Geocode Search Error]', err.message);
      res.status(500).json({ success: false, error: 'Geocoding search failed' });
    }
  } else if (lat && lon) {
    // Reverse geocoding
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });
      if (!response.ok) throw new Error(`Nominatim error: ${response.status}`);
      const data = await response.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown';
      const state = data.address?.state || '';
      res.json({ success: true, data: { city, state, display_name: data.display_name } });
    } catch (err) {
      console.error('[Reverse Geocode Error]', err.message);
      res.status(500).json({ success: false, error: 'Reverse geocoding failed' });
    }
  } else {
    res.status(400).json({ success: false, error: 'lat/lon or q is required' });
  }
});

/**
 * GET /api/weather?city=Ahmedabad  OR  /api/weather?lat=xx&lon=yy
 * Returns current weather data.
 * Uses OpenWeatherMap if WEATHER_API_KEY is configured, else Open-Meteo (free, no key).
 */
router.get('/weather', async (req, res) => {
  const { city, lat, lon } = req.query;

  try {
    // Resolve coords from city name if needed
    let latitude = lat ? parseFloat(lat) : null;
    let longitude = lon ? parseFloat(lon) : null;
    let resolvedCity = city || '';

    if (city && (!latitude || !longitude)) {
      // Use Nominatim to get lat/lon for city
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;
      const geoRes = await fetch(geoUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        latitude = parseFloat(geoData[0].lat);
        longitude = parseFloat(geoData[0].lon);
        resolvedCity = geoData[0].display_name?.split(',')[0] || city;
      } else {
        return res.status(404).json({ success: false, error: `City not found: ${city}` });
      }
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, error: 'Please provide city or lat/lon' });
    }

    let weatherData;

    if (ENV.WEATHER_API_KEY) {
      // OpenWeatherMap (paid key available)
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${ENV.WEATHER_API_KEY}&units=metric`;
      const owmRes = await fetch(owmUrl);
      if (!owmRes.ok) throw new Error(`OWM API error: ${owmRes.status}`);
      const owm = await owmRes.json();
      weatherData = {
        cityName: resolvedCity || owm.name,
        temp: owm.main.temp,
        feels_like: owm.main.feels_like,
        humidity: owm.main.humidity,
        description: owm.weather[0]?.description || '',
        windSpeed: owm.wind?.speed * 3.6, // convert m/s to km/h
        visibility: owm.visibility ? Math.round(owm.visibility / 1000) : null,
        clouds: owm.clouds?.all,
        pressure: owm.main.pressure,
        weatherCode: owm.weather[0]?.id || 800,
        rainChance: owm.rain ? 100 : (owm.clouds?.all > 50 ? Math.round(owm.clouds.all * 0.5) : 0),
        provider: 'openweathermap'
      };
    } else {
      // Open-Meteo (free, no key required)
      const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,cloud_cover,surface_pressure,apparent_temperature&timezone=auto`;
      const meteoRes = await fetch(meteoUrl);
      if (!meteoRes.ok) throw new Error(`Open-Meteo error: ${meteoRes.status}`);
      const meteo = await meteoRes.json();
      const cur = meteo.current;

      const wmoDescriptions = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
        55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Slight snowfall', 73: 'Moderate snowfall', 75: 'Heavy snowfall',
        80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
      };

      weatherData = {
        cityName: resolvedCity,
        temp: cur.temperature_2m,
        feels_like: cur.apparent_temperature,
        humidity: cur.relative_humidity_2m,
        description: wmoDescriptions[cur.weather_code] || 'Unknown',
        windSpeed: cur.wind_speed_10m,
        visibility: null,
        clouds: cur.cloud_cover,
        pressure: cur.surface_pressure,
        weatherCode: mapWmoToOwmCode(cur.weather_code),
        rainChance: [51,53,55,61,63,65,80,81,82,95,96,99].includes(cur.weather_code) ? 80 : (cur.cloud_cover > 50 ? Math.round(cur.cloud_cover * 0.5) : 0),
        provider: 'open-meteo'
      };
    }

    res.json({ success: true, data: weatherData });
  } catch (err) {
    console.error('[Weather Error]', err.message);
    res.status(500).json({ success: false, error: 'Weather fetch failed: ' + err.message });
  }
});


export default router;

