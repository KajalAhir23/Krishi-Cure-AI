// Fertilizer Calculator Controller - Professional Logic

const convertAreaToHectares = (area, unit) => {
    const val = parseFloat(area) || 0;
    switch (unit) {
        case 'Bigha':
            return val * 0.25; // standard approximation
        case 'Acre':
            return val * 0.4047;
        case 'Hectare':
            return val;
        default:
            return val;
    }
};

const cropBaseRates = {
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

const localizationData = {
    en: {
        fertilizers: {
            urea: "Urea", dap: "DAP", npk: "NPK 19:19:19", potash: "Muriate of Potash (MOP)",
            ssp: "Single Super Phosphate (SSP)", ammonium_sulphate: "Ammonium Sulphate",
            zinc_sulphate: "Zinc Sulphate", organic_compost: "Organic Compost", vermicompost: "Vermicompost"
        },
        methods: {
            basal: "Basal application (apply to soil before or during sowing).",
            top_dress: "Top dressing (broadcast evenly on wet soil near roots).",
            foliar: "Foliar spray (dissolve in water and spray on leaves).",
            soil_mix: "Soil mixing (mix well with the topsoil around the plant base)."
        },
        schedules: {
            urea: "Apply 50% at sowing (basal) and remaining 50% in two equal split doses at 30 and 45 days after sowing (during irrigation).",
            dap: "Apply 100% at the time of sowing as basal dose.",
            npk: "Apply 50% at sowing and 50% at 30 days after sowing.",
            potash: "Apply 100% as basal dose at sowing, or split if soil is very sandy.",
            ssp: "Apply 100% at the time of sowing.",
            ammonium_sulphate: "Apply in 2 split doses: 50% at sowing and 50% at active tillering/vegetative phase.",
            zinc_sulphate: "Apply 100% to soil during land preparation, once every 2 seasons.",
            organic_compost: "Spread evenly on fields and incorporate into soil during land preparation (15-20 days before sowing).",
            vermicompost: "Incorporate into root zones before sowing or top dress near plants during vegetative stage."
        },
        precautions: {
            urea: "Do not apply on dry soil. Avoid direct contact with seeds/leaves to prevent chemical burn. Irrigate within 24 hours.",
            dap: "Mix well with soil; do not place directly adjacent to germinating seeds.",
            npk: "Apply near the root zone but not touching the main stem.",
            potash: "Maintain optimum soil moisture; avoid contact with foliage when wet.",
            ssp: "Incorporate deeply into soil to prevent phosphorus fixation.",
            ammonium_sulphate: "Store in dry place. Do not mix with lime or alkaline fertilizers.",
            zinc_sulphate: "Do not mix directly with phosphatic fertilizers (DAP/SSP) to avoid nutrient lock.",
            organic_compost: "Ensure the compost is fully decomposed to prevent pest/disease transfer.",
            vermicompost: "Keep root zone moist after application for maximum micro-organism activity."
        },
        recommendations: "Follow regional KVK guidelines, monitor soil health cards, and adjust application rates based on actual soil fertility tests."
    },
    hi: {
        fertilizers: {
            urea: "यूरिया", dap: "डीएपी (DAP)", npk: "एनपीके (NPK 19:19:19)", potash: "पोटाश (MOP)",
            ssp: "सिंगल सुपर फास्फेट (SSP)", ammonium_sulphate: "अमोनियम सल्फेट",
            zinc_sulphate: "जिंक सल्फेट", organic_compost: "जैविक खाद (कम्पोस्ट)", vermicompost: "वर्मीकंपोस्ट (केंचुआ खाद)"
        },
        methods: {
            basal: "बेसल ड्रेसिंग (बुवाई के समय या पहले मिट्टी में मिलाना)।",
            top_dress: "टॉप ड्रेसिंग (गीली मिट्टी में पौधों के पास समान रूप से छिड़काव करना)।",
            foliar: "पर्णीय छिड़काव (पानी में घोलकर पत्तियों पर स्प्रे करना)।",
            soil_mix: "मिट्टी में मिलाना (पौधे के आधार के चारों ओर ऊपरी मिट्टी में अच्छी तरह मिलाना)।"
        },
        schedules: {
            urea: "50% मात्रा बुवाई के समय (बेसल) डालें, और शेष 50% मात्रा को दो बराबर भागों में बुवाई के 30 और 45 दिनों के बाद (सिंचाई के समय) डालें।",
            dap: "बुवाई के समय 100% मात्रा बेसल खुराक के रूप में मिट्टी में डालें।",
            npk: "50% मात्रा बुवाई के समय और शेष 50% बुवाई के 30 दिनों के बाद डालें।",
            potash: "बुवाई के समय 100% मात्रा बेसल खुराक के रूप में डालें। रेतीली मिट्टी में इसे दो भागों में बांट सकते हैं।",
            ssp: "बुवाई के समय 100% मात्रा बेसल खुराक के रूप में मिट्टी में डालें।",
            ammonium_sulphate: "2 भागों में डालें: 50% बुवाई के समय और 50% कल्ले निकलने या वनस्पति विकास के समय।",
            zinc_sulphate: "खेत की तैयारी के दौरान 100% मात्रा मिट्टी में डालें, हर 2 सीजन में एक बार।",
            organic_compost: "खेत की तैयारी के दौरान (बुवाई से 15-20 दिन पहले) खेत में समान रूप से फैलाकर मिट्टी में मिलाएं।",
            vermicompost: "बुवाई से पहले जड़ क्षेत्र में मिलाएं या वनस्पति विकास चरण के दौरान पौधों के पास डालें।"
        },
        precautions: {
            urea: "सूखी मिट्टी पर न डालें। रासायनिक जलन से बचने के लिए बीज/पत्तियों से सीधे संपर्क से बचाएं। 24 घंटे के भीतर सिंचाई करें।",
            dap: "मिट्टी के साथ अच्छी तरह मिलाएं; अंकुरित बीजों के बिल्कुल पास न रखें।",
            npk: "जड़ क्षेत्र के पास लगाएं लेकिन मुख्य तने को छूने न दें।",
            potash: "मिट्टी में पर्याप्त नमी बनाए रखें; गीली पत्तियों से संपर्क से बचाएं।",
            ssp: "फास्फोरस स्थिरीकरण को रोकने के लिए मिट्टी में गहराई से मिलाएं।",
            ammonium_sulphate: "सूखे स्थान पर रखें। चूने या क्षारीय उर्वरकों के साथ न मिलाएं।",
            zinc_sulphate: "पोषक तत्वों के लॉक होने से बचने के लिए फास्फोरस उर्वरकों (डीएपी/एसएसपी) के साथ सीधे न मिलाएं।",
            organic_compost: "सुनिश्चित करें कि कम्पोस्ट पूरी तरह से सड़ा हुआ हो ताकि कीट/रोग न फैलें।",
            vermicompost: "अधिकतम सूक्ष्मजीव गतिविधि के लिए उपयोग के बाद जड़ क्षेत्र को नम रखें।"
        },
        recommendations: "स्थानीय कृषि विज्ञान केंद्र (KVK) के दिशानिर्देशों का पालन करें, मृदा स्वास्थ्य कार्ड की जांच करें और मिट्टी परीक्षण रिपोर्ट के आधार पर मात्रा समायोजित करें।"
    },
    gu: {
        fertilizers: {
            urea: "યુરિયા", dap: "ડીએપી (DAP)", npk: "એનપીકે (NPK 19:19:19)", potash: "પોટાશ (MOP)",
            ssp: "સિંગલ સુપર ફોસ્ફેટ (SSP)", ammonium_sulphate: "એમોનિયમ સલ્ફેટ",
            zinc_sulphate: "ઝિંક સલ્ફેટ", organic_compost: "દેશી સેન્દ્રિય ખાતર", vermicompost: "વર્મીકમ્પોસ્ટ (અળસિયા ખાતર)"
        },
        methods: {
            basal: "પાયાનું ખાતર (વાવણી પહેલાં અથવા વાવણી વખતે જમીનમાં આપવું).",
            top_dress: "પૂરક ખાતર (ભીની જમીનમાં મૂળ પાસે સમાન રીતે આપવું).",
            foliar: "પાંદડા પર છંટકાવ (પાણીમાં ઓગાળીને પાંદડા પર સ્પ્રે કરવો).",
            soil_mix: "માટીમાં ભેળવવું (છોડની આસપાસની માટીમાં બરાબર મિક્સ કરવું)."
        },
        schedules: {
            urea: "૫૦% વાવણી વખતે પાયાના ખાતર તરીકે આપો, અને બાકીનું ૫૦% ખાતર બે સરખા હપ્તામાં વાવણીના ૩૦ અને ૪૫ દિવસે (પિયત આપતી વખતે) આપો.",
            dap: "૧૦૦% ખાતર વાવણી વખતે જ પાયાના ડોઝ તરીકે આપો.",
            npk: "૫૦% વાવણી વખતે અને ૫૦% વાવણીના ૩૦ દિવસ પછી આપો.",
            potash: "૧００% વાવણી વખતે પાયાના ખાતર તરીકે આપો. જો જમીન ખૂબ રેતાળ હોય તો બે વાર આપો.",
            ssp: "૧૦૦% ખાતર વાવણી વખતે જ પાયાના ડોઝ તરીકે આપો.",
            ammonium_sulphate: "બે સરખા હપ્તામાં આપો: ૫૦% વાવણી વખતે અને ૫૦% ફૂટ અને વાનસ્પતિક વૃદ્ધિ સમયે.",
            zinc_sulphate: "જમીન તૈયાર કરતી વખતે ૧૦૦% ખાતર આપો, ૨ સીઝનમાં એક વાર.",
            organic_compost: "જમીન તૈયાર કરતી વખતે (વાવણીના ૧૫-૨૦ દિવસ પહેલાં) ખેતરમાં સરખી રીતે પાથરીને માટીમાં ભેળવી દો.",
            vermicompost: "વાવણી પહેલાં મૂળ વિસ્તારની માટીમાં ભેળવી દો અથવા પાકની વૃદ્ધિ દરમિયાન છોડની નજીક આપો."
        },
        precautions: {
            urea: "સૂકી જમીન પર ખાતર ન આપો. રાસાયણિક નુકસાન ટાળવા બીજ કે પાંદડા સાથે સીધો સંપર્ક ટાળો. ૨૪ કલાકમાં પિયત આપો.",
            dap: "માટી સાથે બરાબર ભેળવી દો; ઉગતા બીજની એકદમ નજીક ન આપો.",
            npk: "મૂળ વિસ્તારની નજીક આપો પણ મુખ્ય થડને સ્પર્શે નહીં તેની કાળજી રાખો.",
            potash: "જમીનમાં પૂરતો ભેજ જાળવી રાખો; ભીના પાંદડા પર ખાતર ન નાખો.",
            ssp: "ફોસ્ફરસ જમીનમાં જકડાઈ ન જાય તે માટે ઊંડે સુધી મિક્સ કરો.",
            ammonium_sulphate: "સૂકી જગ્યાએ સંગ્રહ કરો. ચૂના કે બેઝિક ખાતર સાથે ન ભેળવો.",
            zinc_sulphate: "પોષક તત્વો બ્લોક ન થાય તે માટે ફોસ્ફરસ ખાતરો (DAP/SSP) સાથે સીધું ન ભેળવવું.",
            organic_compost: "ખાસ ખાતરી કરો કે સેન્દ્રિય ખાતર બરાબર સડેલું હોય જેથી કીડા કે રોગ ન આવે.",
            vermicompost: "અળસિયા ખાતર આપ્યા પછી ભેજ જાળવી રાખો જેથી જીવાણુઓ સક્રિય રહે."
        },
        recommendations: "સ્થાનિક કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) ની માર્ગદર્શિકા જુઓ, સોઇલ હેલ્થ કાર્ડ મુજબ ખાતરની માત્રામાં ફેરફાર કરી શકો છો."
    }
};

const getMethodKey = (fertilizerId) => {
    if (['organic_compost', 'vermicompost'].includes(fertilizerId)) {
        return 'soil_mix';
    }
    if (['zinc_sulphate'].includes(fertilizerId)) {
        return 'basal';
    }
    return 'top_dress';
};

export function calculateFertilizer(cropId, fertilizerId, areaUnit, areaValue, lang = 'en') {
    const selectedLang = ['en', 'hi', 'gu'].includes(lang) ? lang : 'en';
    const cleanCropId = (cropId || '').toLowerCase();
    const cleanFertId = (fertilizerId || '').toLowerCase();

    const cropRates = cropBaseRates[cleanCropId] || cropBaseRates['generic'];
    const baseRatePerHa = cropRates[cleanFertId] || cropBaseRates['generic'][cleanFertId] || 100;

    const hectares = convertAreaToHectares(areaValue, areaUnit);
    const calculatedQty = parseFloat((hectares * baseRatePerHa).toFixed(2));
    const qtyPerUnitArea = parseFloat((calculatedQty / (parseFloat(areaValue) || 1)).toFixed(2));

    const localData = localizationData[selectedLang];

    return {
        crop: cropId,
        fertilizer_id: fertilizerId,
        fertilizer_name: localData.fertilizers[cleanFertId] || fertilizerId,
        area: {
            value: parseFloat(areaValue) || 0,
            unit: areaUnit,
            hectares: parseFloat(hectares.toFixed(4))
        },
        quantity: calculatedQty,
        quantity_per_unit: qtyPerUnitArea,
        schedule: localData.schedules[cleanFertId] || "Apply according to crop schedule.",
        method: localData.methods[getMethodKey(cleanFertId)] || localData.methods.top_dress,
        precautions: localData.precautions[cleanFertId] || "Wear protective gear during fertilizer application.",
        recommendations: localData.recommendations
    };
}
