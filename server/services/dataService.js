/**
 * Data Service - Crops & Master Data Management
 * Loads, caches, and provides access to crops data
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DataService {
  constructor() {
    this.cropsData = null;
    this.lastLoadTime = null;
    this.dataPath = path.join(__dirname, '../../data/crops.json');
  }

  /**
   * Loads crops data from file
   * @returns {Promise<Object|null>} - Crops data or null if error
   */
  async loadCropsData() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      this.cropsData = JSON.parse(data);
      this.lastLoadTime = Date.now();
      console.log('✅ Crops data loaded successfully');
      return this.cropsData;
    } catch (error) {
      console.error('❌ Error loading crops data:', error.message);
      return null;
    }
  }

  /**
   * Gets crops data with caching
   * Reloads if cache is stale
   * @returns {Promise<Object|null>} - Crops data
   */
  async getCropsData() {
    // Return cached data if available and fresh
    if (this.cropsData && this.lastLoadTime) {
      const age = Date.now() - this.lastLoadTime;
      if (age < CONFIG.CACHE.TTL_DATA) {
        return this.cropsData;
      }
    }

    // Load fresh data
    return await this.loadCropsData();
  }

  /**
   * Gets a crop name by ID
   * @param {string} cropId - Crop identifier
   * @param {string} lang - Language code
   * @returns {string|null} - Crop name or null
   */
  async getCropName(cropId, lang = 'en') {
    const data = await this.getCropsData();
    if (!data || !data.cropsList) return null;

    for (const category in data.cropsList) {
      const crop = data.cropsList[category].find(c => c.id === cropId);
      if (crop) {
        return crop[lang] || crop['en'] || 'Unknown Crop';
      }
    }
    return null;
  }

  /**
   * Gets symptom name by ID
   * @param {string} symptomId - Symptom identifier
   * @param {string} lang - Language code
   * @returns {string|null} - Symptom name or null
   */
  async getSymptomName(symptomId, lang = 'en') {
    const data = await this.getCropsData();
    if (!data || !data.symptomsList) return null;

    const symptom = data.symptomsList.find(s => s.id === symptomId);
    return symptom ? (symptom[lang] || symptom['en'] || symptomId) : null;
  }

  /**
   * Gets crop profile for additional context
   * @param {string} cropId - Crop identifier
   * @returns {Object|null} - Crop profile or null
   */
  async getCropProfile(cropId) {
    const data = await this.getCropsData();
    if (!data || !data.cropProfiles) return null;
    return data.cropProfiles[cropId] || null;
  }

  /**
   * Gets all symptoms for a crop
   * @param {string} cropId - Crop identifier
   * @param {string} lang - Language code
   * @returns {Array<string>} - Array of symptom names
   */
  async getCropSymptoms(cropId, lang = 'en') {
    const profile = await this.getCropProfile(cropId);
    if (!profile || !profile.symptoms) return [];

    const symptoms = [];
    for (const symId of profile.symptoms) {
      const name = await this.getSymptomName(symId, lang);
      if (name) symptoms.push(name);
    }
    return symptoms;
  }

  /**
   * Converts symptom IDs to symptom names
   * @param {Array<string>} symptomIds - Array of symptom IDs
   * @param {string} lang - Language code
   * @returns {Promise<Array<string>>} - Array of symptom names
   */
  async convertSymptomIds(symptomIds, lang = 'en') {
    if (!Array.isArray(symptomIds)) return [];

    const names = [];
    for (const id of symptomIds) {
      const name = await this.getSymptomName(id, lang);
      if (name) names.push(name);
    }
    return names;
  }

  /**
   * Clears the cached data
   */
  clearCache() {
    this.cropsData = null;
    this.lastLoadTime = null;
    console.log('Cache cleared');
  }
}

// Export singleton instance
export const dataService = new DataService();

// Pre-load data on startup
dataService.loadCropsData().catch(err => {
  console.error('Failed to pre-load crops data:', err);
});

export default dataService;
