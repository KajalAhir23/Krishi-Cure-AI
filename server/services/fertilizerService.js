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
    },
    schedules: {
      urea: '50% बुवाई के समय (बेसल) और शेष 50% बुवाई के 30 और 45 दिन बाद दो बराबर विभाजित खुराकों में (सिंचाई के दौरान) डालें।',
      dap: 'बुवाई के समय 100% बेसल खुराक के रूप में डालें।',
      npk: '50% बुवाई के समय और 50% बुवाई के 30 दिन बाद डालें।',
      potash: 'बुवाई के समय 100% बेसल खुराक के रूप में डालें, या यदि मिट्टी बहुत रेतीली हो तो विभाजित करें।',
      ssp: '100% बुवाई के समय डालें।',
      ammonium_sulphate: '2 विभाजित खुराकों में डालें: 50% बुवाई के समय और 50% सक्रिय कल्ले निकलने/वानस्पतिक अवस्था के दौरान।',
      zinc_sulphate: 'खेत की तैयारी के दौरान मिट्टी में 100% डालें, प्रत्येक 2 मौसमों में एक बार।',
      organic_compost: 'खेतों में समान रूप से फैलाएं और बुवाई से 15-20 दिन पहले खेत की तैयारी के दौरान मिट्टी में मिलाएं।',
      vermicompost: 'बुवाई से पहले जड़ों के पास मिलाएं या वानस्पतिक अवस्था के दौरान पौधों के पास टॉप ड्रेसिंग करें।'
    },
    precautions: {
      urea: 'सूखी मिट्टी पर न डालें। बीजों/पत्तियों के सीधे संपर्क से बचें। 24 घंटे के भीतर सिंचाई करें।',
      dap: 'मिट्टी के साथ अच्छी तरह मिलाएं; अंकुरित बीजों के बिल्कुल पास न रखें।',
      npk: 'मुख्य तने को छुए बिना जड़ क्षेत्र के पास डालें।',
      potash: 'मिट्टी की नमी इष्टतम बनाए रखें; गीली पत्तियों के संपर्क से बचें।',
      ssp: 'फॉस्फोरस स्थिरीकरण (fixation) को रोकने के लिए मिट्टी में गहराई से मिलाएं।',
      ammonium_sulphate: 'सूखी जगह पर स्टोर करें। चूने या क्षारीय खादों के साथ न मिलाएं।',
      zinc_sulphate: 'फॉस्फेटिक खादों (डीएपी/एसएसपी) के साथ सीधे न मिलाएं।',
      organic_compost: 'कीट/रोग के संक्रमण को रोकने के लिए सुनिश्चित करें कि खाद पूरी तरह से सड़ी हुई हो।',
      vermicompost: 'अधिकतम सूक्ष्मजीव गतिविधि के लिए डालने के बाद जड़ क्षेत्र को नम रखें।'
    },
    recommendations: 'क्षेत्रीय केवीके (KVK) दिशानिर्देशों का पालन करें, मृदा स्वास्थ्य कार्ड की निगरानी करें, और वास्तविक मृदा परीक्षण के आधार पर दरों को समायोजित करें।'
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
    },
    schedules: {
      urea: '૫૦% વાવણી વખતે (પાયામાં) અને બાકીનું ૫૦% વાવણી પછી ૩૦ અને ૪૫ દિવસે બે સમાન હપ્તામાં (પિયત આપતી વખતે) આપવું.',
      dap: 'વાવણી સમયે ૧૦૦% પાયાના ખાતર તરીકે આપવું.',
      npk: '૫૦% વાવણી વખતે અને ૫૦% વાવણીના ૩૦ દિવસ પછી આપવું.',
      potash: 'વાવણી વખતે પાયાના ખાતર તરીકે ૧૦૦% આપવું, અથવા જો જમીન ખૂબ રેતાળ હોય તો બે હપ્તામાં આપવું.',
      ssp: '૧૦૦% વાવણી સમયે જમીનમાં આપવું.',
      ammonium_sulphate: '૨ સમાન હપ્તામાં આપવું: ૫૦% વાવણી વખતે અને ૫૦% છોડના વિકાસ/ફૂટના સમયગાળા દરમિયાન.',
      zinc_sulphate: 'જમીન તૈયાર કરતી વખતે ૧૦૦% જમીનમાં આપવું, દર ૨ સીઝનમાં એક વાર.',
      organic_compost: 'ખેતરમાં સમાન રીતે ફેલાવો અને વાવણીના ૧૫-૨૦ દિવસ પહેલાં જમીન તૈયાર કરતી વખતે ભેળવી દો.',
      vermicompost: 'વાવણી પહેલાં મૂળના વિસ્તારમાં ભેળવો અથવા છોડના વિકાસ દરમિયાન છોડની આસપાસ આપો.'
    },
    precautions: {
      urea: 'સૂકી જમીન પર ખાતર ન આપવું. બીજ/પાંદડા સાથે સીધા સંપર્કથી બચો. ૨૪ કલાકમાં પિયત આપવું.',
      dap: 'માટી સાથે બરાબર મિક્સ કરો; ઉગતા બીજની બિલકુલ નજીક ન મૂકવું.',
      npk: 'મુખ્ય થડને અડ્યા વિના મૂળની નજીક આપવું.',
      potash: 'જમીનમાં પૂરતો ભેજ જાળવી રાખો; ભીના પાંદડા પર પડવા ન દેવું.',
      ssp: 'ફોસ્ફરસનું જમીનમાં સ્થિરીકરણ (fixation) અટકાવવા માટે ઊંડે સુધી માટીમાં ભેળવવું.',
      ammonium_sulphate: 'સૂકી જગ્યાએ સંગ્રહ કરવો. ચૂનો અથવા આલ્કલાઇન ખાતરો સાથે મિક્સ ન કરવું.',
      zinc_sulphate: 'ફોસ્ફેટ યુક્ત ખાતરો (DAP/SSP) સાથે સીધું મિક્સ ન કરવું.',
      organic_compost: 'કીટક/રોગોનો ફેલાવો અટકાવવા માટે ખાતર સંપૂર્ણપણે સડેલું હોવું જરૂરી છે.',
      vermicompost: 'મહત્તમ સુક્ષ્મજીવોની સક્રિયતા માટે ખાતર આપ્યા પછી મૂળ વિસ્તારમાં ભેજ જાળવવો.'
    },
    recommendations: 'સ્થાનિક કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) ના માર્ગદર્શનનું પાલન કરો, સોઇલ હેલ્થ કાર્ડ તપાસો અને જમીન પરીક્ષણના આધારે ખાતરનો જથ્થો નક્કી કરો.'
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
