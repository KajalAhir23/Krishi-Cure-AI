/**
 * Fertilizer Service - Fertilizer Calculation Logic
 * Handles fertilizer requirement calculations and recommendations
 */

import { CONFIG } from '../config/constants.js';

/**
 * Fertilizer base rates per hectare by crop
 * Rates are in kg/hectare
 */
const CROP_FERTILIZER_RATES = {
  cotton: {
    urea: 180, dap: 100, npk: 120, potash: 80, ssp: 200,
    ammonium_sulphate: 140, zinc_sulphate: 30, organic_compost: 8000, vermicompost: 4000
  },
  groundnut: {
    urea: 50, dap: 120, npk: 100, potash: 50, ssp: 250,
    ammonium_sulphate: 60, zinc_sulphate: 20, organic_compost: 5000, vermicompost: 2500
  },
  wheat: {
    urea: 120, dap: 80, npk: 100, potash: 60, ssp: 150,
    ammonium_sulphate: 100, zinc_sulphate: 25, organic_compost: 5000, vermicompost: 2500
  },
  rice: {
    urea: 150, dap: 90, npk: 110, potash: 60, ssp: 160,
    ammonium_sulphate: 120, zinc_sulphate: 25, organic_compost: 6000, vermicompost: 3000
  },
  cumin: {
    urea: 60, dap: 60, npk: 80, potash: 40, ssp: 100,
    ammonium_sulphate: 50, zinc_sulphate: 15, organic_compost: 4000, vermicompost: 2000
  },
  generic: {
    urea: 100, dap: 80, npk: 100, potash: 50, ssp: 120,
    ammonium_sulphate: 80, zinc_sulphate: 20, organic_compost: 5000, vermicompost: 2500
  }
};

/**
 * Localized fertilizer information
 */
const LOCALIZATION_DATA = {
  en: {
    fertilizers: {
      urea: 'Urea',
      dap: 'DAP',
      npk: 'NPK 19:19:19',
      potash: 'Muriate of Potash (MOP)',
      ssp: 'Single Super Phosphate (SSP)',
      ammonium_sulphate: 'Ammonium Sulphate',
      zinc_sulphate: 'Zinc Sulphate',
      organic_compost: 'Organic Compost',
      vermicompost: 'Vermicompost'
    },
    methods: {
      basal: 'Basal application (apply to soil before or during sowing).',
      top_dress: 'Top dressing (broadcast evenly on wet soil near roots).',
      foliar: 'Foliar spray (dissolve in water and spray on leaves).',
      soil_mix: 'Soil mixing (mix well with the topsoil around the plant base).'
    },
    schedules: {
      urea: 'Apply 50% at sowing (basal) and remaining 50% in two equal split doses at 30 and 45 days after sowing (during irrigation).',
      dap: 'Apply 100% at the time of sowing as basal dose.',
      npk: 'Apply 50% at sowing and 50% at 30 days after sowing.',
      potash: 'Apply 100% as basal dose at sowing, or split if soil is very sandy.',
      ssp: 'Apply 100% at the time of sowing.',
      ammonium_sulphate: 'Apply in 2 split doses: 50% at sowing and 50% at active tillering/vegetative phase.',
      zinc_sulphate: 'Apply 100% to soil during land preparation, once every 2 seasons.',
      organic_compost: 'Spread evenly on fields and incorporate into soil during land preparation (15-20 days before sowing).',
      vermicompost: 'Incorporate into root zones before sowing or top dress near plants during vegetative stage.'
    },
    methods_applied: {
      basal: 'Basal application',
      top_dress: 'Top dressing',
      foliar: 'Foliar spray',
      soil_mix: 'Soil mixing'
    },
    precautions: {
      urea: 'Do not apply on dry soil. Avoid direct contact with seeds/leaves. Irrigate within 24 hours.',
      dap: 'Mix well with soil; do not place directly adjacent to germinating seeds.',
      npk: 'Apply near the root zone but not touching the main stem.',
      potash: 'Maintain optimum soil moisture; avoid contact with foliage when wet.',
      ssp: 'Incorporate deeply into soil to prevent phosphorus fixation.',
      ammonium_sulphate: 'Store in dry place. Do not mix with lime or alkaline fertilizers.',
      zinc_sulphate: 'Do not mix directly with phosphatic fertilizers (DAP/SSP).',
      organic_compost: 'Ensure the compost is fully decomposed to prevent pest/disease transfer.',
      vermicompost: 'Keep root zone moist after application for maximum micro-organism activity.'
    },
    recommendations: 'Follow regional KVK guidelines, monitor soil health cards, and adjust rates based on actual soil fertility tests.'
  },
  hi: {
    fertilizers: {
      urea: 'यूरिया', dap: 'डीएपी (DAP)', npk: 'एनपीके (NPK 19:19:19)', potash: 'पोटाश (MOP)',
      ssp: 'सिंगल सुपर फास्फेट (SSP)', ammonium_sulphate: 'अमोनियम सल्फेट',
      zinc_sulphate: 'जिंक सल्फेट', organic_compost: 'जैविक खाद (कम्पोस्ट)', vermicompost: 'वर्मीकंपोस्ट (केंचुआ खाद)'
    },
    methods: {
      basal: 'बेसल ड्रेसिंग (बुवाई के समय या पहले मिट्टी में मिलाना)।',
      top_dress: 'टॉप ड्रेसिंग (गीली मिट्टी में पौधों के पास समान रूप से छिड़काव)।',
      foliar: 'पर्णीय छिड़काव (पानी में घोलकर पत्तियों पर स्प्रे करना)।',
      soil_mix: 'मिट्टी में मिलाना (पौधे के आधार के चारों ओर ऊपरी मिट्टी में अच्छी तरह मिलाना)।'
    },
    methods_applied: {
      basal: 'बेसल ड्रेसिंग',
      top_dress: 'टॉप ड्रेसिंग',
      foliar: 'पर्णीय छिड़काव',
      soil_mix: 'मिट्टी में मिलाना'
    }
  },
  gu: {
    fertilizers: {
      urea: 'યુરિયા', dap: 'ડીએપી (DAP)', npk: 'એનપીકે (NPK 19:19:19)', potash: 'પોટાશ (MOP)',
      ssp: 'સિંગલ સુપર ફોસ્ફેટ (SSP)', ammonium_sulphate: 'એમોનિયમ સલ્ફેટ',
      zinc_sulphate: 'ઝિંક સલ્ફેટ', organic_compost: 'દેશી સેન્દ્રિય ખાતર', vermicompost: 'વર્મીકમ્પોસ્ટ'
    },
    methods: {
      basal: 'પાયાનું ખાતર (વાવણી પહેલાં અથવા વાવણી વખતે જમીનમાં આપવું).',
      top_dress: 'પૂરક ખાતર (ભીની જમીનમાં મૂળ પાસે સમાન રીતે આપવું).',
      foliar: 'પાંદડા પર છંટકાવ (પાણીમાં ઓગાળીને પાંદડા પર સ્પ્રે કરવો).',
      soil_mix: 'માટીમાં ભેળવવું (છોડની આસપાસની માટીમાં બરાબર મિક્સ કરવું).'
    },
    methods_applied: {
      basal: 'પાયાનું ખાતર',
      top_dress: 'પૂરક ખાતર',
      foliar: 'પાંદડા પર છંટકાવ',
      soil_mix: 'માટીમાં ભેળવવું'
    }
  }
};

class FertilizerService {
  /**
   * Converts area to hectares based on unit
   * @param {number} area - Area value
   * @param {string} unit - Area unit (Bigha, Acre, Hectare)
   * @returns {number} - Area in hectares
   */
  convertAreaToHectares(area, unit) {
    const value = parseFloat(area) || 0;

    switch (unit) {
      case 'Bigha':
        return value * CONFIG.FERTILIZER.AREA_CONVERSION.BIGHA;
      case 'Acre':
        return value * CONFIG.FERTILIZER.AREA_CONVERSION.ACRE;
      case 'Hectare':
        return value * CONFIG.FERTILIZER.AREA_CONVERSION.HECTARE;
      default:
        return value;
    }
  }

  /**
   * Gets application method for fertilizer
   * @param {string} fertilizerId - Fertilizer ID
   * @returns {string} - Method key
   */
  getApplicationMethod(fertilizerId) {
    if (['organic_compost', 'vermicompost'].includes(fertilizerId)) {
      return 'soil_mix';
    }
    if (['zinc_sulphate'].includes(fertilizerId)) {
      return 'basal';
    }
    return 'top_dress';
  }

  /**
   * Calculates fertilizer requirements
   * @param {Object} input - Calculation input
   * @returns {Object} - Fertilizer calculation result
   */
  calculateFertilizerRequirements(input) {
    const {
      cropId,
      fertilizerId,
      areaUnit,
      areaValue,
      lang = 'en'
    } = input;

    // Normalize language and IDs
    const selectedLang = ['en', 'hi', 'gu'].includes(lang) ? lang : 'en';
    const cleanCropId = (cropId || '').toLowerCase();
    const cleanFertId = (fertilizerId || '').toLowerCase();

    // Get fertilizer rates for crop
    const cropRates = CROP_FERTILIZER_RATES[cleanCropId] || CROP_FERTILIZER_RATES.generic;
    const baseRatePerHa = cropRates[cleanFertId] || 100;

    // Convert area to hectares
    const hectares = this.convertAreaToHectares(areaValue, areaUnit);

    // Calculate total quantity
    const calculatedQty = parseFloat((hectares * baseRatePerHa).toFixed(2));
    const qtyPerUnitArea = parseFloat((calculatedQty / (parseFloat(areaValue) || 1)).toFixed(2));

    // Get localized data
    const localData = LOCALIZATION_DATA[selectedLang] || LOCALIZATION_DATA.en;
    const applicationMethod = this.getApplicationMethod(cleanFertId);

    return {
      success: true,
      crop: cropId,
      fertilizer_id: fertilizerId,
      fertilizer_name: localData.fertilizers[cleanFertId] || fertilizerId,
      area: {
        value: parseFloat(areaValue) || 0,
        unit: areaUnit,
        hectares: parseFloat(hectares.toFixed(4))
      },
      quantity: {
        total: calculatedQty,
        per_unit_area: qtyPerUnitArea,
        unit: 'kg'
      },
      application: {
        method: localData.methods_applied[applicationMethod] || applicationMethod,
        details: localData.methods[applicationMethod] || 'Apply according to crop schedule.'
      },
      schedule: localData.schedules ? localData.schedules[cleanFertId] : 'Apply according to crop schedule.',
      precautions: localData.precautions ? localData.precautions[cleanFertId] : 'Wear protective gear during application.',
      recommendations: localData.recommendations || 'Follow regional KVK guidelines.'
    };
  }
}

export const fertilizerService = new FertilizerService();

export default fertilizerService;
