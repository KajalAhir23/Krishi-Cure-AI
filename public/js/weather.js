/**
 * Krishi-Cure Pro - Smart Weather & Agriculture Advisory System
 * Fixed: Idempotent init, no duplicate fetches, robust error handling,
 *        proper geocode name parsing, clean language switching.
 */

(function () {
    // ── Translation Dictionary ──────────────────────────────────────────────
    const weatherTranslations = {
        en: {
            title: "Weather Care Advisory",
            humidity: "Humidity",
            rainChance: "Rain Chance",
            windSpeed: "Wind Speed",
            sunrise: "Sunrise",
            sunset: "Sunset",
            feelsLike: "Feels Like",
            pressure: "Pressure",
            visibility: "Visibility",
            diseaseRisk: "Disease Risk Alert",
            irrigation: "Irrigation Suggestion",
            warning: "Weather Warning",
            loading: "Fetching live weather and agriculture advisory...",
            error: "Unable to load weather. Please check your internet and try again.",
            retry: "Retry",
            localFallbackBadge: "Default Location",
            detectedLocationBadge: "Live Location",
            manualLocationBadge: "Custom Location",
            localFallbackCityName: "Anand",
            changeLocation: "Change Location",
            searchPlaceholder: "Type village, district or city...",
            searchBtn: "Search",
            mapInstruction: "Click on the map or search above to choose your location",
            confirmLocation: "Confirm Location",
            cancelBtn: "Cancel",
            searching: "Searching...",
            noResults: "No results found. Try a different name.",
            unavailable: "Unavailable",
            stableCode: "Weather looks stable. Keep monitoring crops.",
            normalIrrig: "Water normally based on soil dampness.",
            stableWarning: "Weather is normal. Ideal for spraying or fertilizing.",
            cond_clear: "Clear Sky", cond_cloudy: "Partly Cloudy", cond_foggy: "Foggy Weather",
            cond_drizzle: "Light Drizzle", cond_rainy: "Rainy", cond_snowy: "Snowy", cond_stormy: "Thunderstorm",
            risk_high_fungal: "High Fungal Risk", risk_wet_alert: "Wet Condition Alert",
            risk_pest_alert: "Pest Warning", risk_stable: "Low Disease Risk",
            irrig_delay: "Postpone Irrigation", irrig_evap: "High Evaporation",
            irrig_reduce: "Limit Irrigation", irrig_normal: "Normal Schedule",
            warn_wind: "High Wind Alert", warn_heat: "Extreme Heat Alert",
            warn_storm: "Storm Safety Alert", warn_cold: "Frost Danger Alert", warn_safe: "Normal Conditions"
        },
        hi: {
            title: "मौसम एवं फसल सलाह",
            humidity: "नमी (हवा में)",
            rainChance: "बारिश की संभावना",
            windSpeed: "हवा की गति",
            sunrise: "सूर्योदय",
            sunset: "सूर्यास्त",
            feelsLike: "ऐसा महसूस होता है",
            pressure: "वायुमंडलीय दबाव",
            visibility: "दृश्यता",
            diseaseRisk: "रोग का खतरा अलर्ट",
            irrigation: "सिंचाई का सुझाव",
            warning: "मौसम चेतावनी",
            loading: "लाइव मौसम और कृषि सलाह लोड की जा रही है...",
            error: "मौसम डेटा लोड करने में विफल। कृपया इंटरनेट जांचें और पुन: प्रयास करें।",
            retry: "पुनः प्रयास करें",
            localFallbackBadge: "डिफ़ॉल्ट स्थान",
            detectedLocationBadge: "लाइव स्थान",
            manualLocationBadge: "चुना हुआ स्थान",
            localFallbackCityName: "आणंद",
            changeLocation: "स्थान बदलें",
            searchPlaceholder: "गाँव, जिला या शहर का नाम लिखें...",
            searchBtn: "खोजें",
            mapInstruction: "नक्शे पर क्लिक करें या ऊपर खोजें",
            confirmLocation: "स्थान सुनिश्चित करें",
            cancelBtn: "रद्द करें",
            searching: "खोज जारी है...",
            noResults: "कोई परिणाम नहीं मिला। कोई अलग नाम आज़माएं।",
            unavailable: "अनुपलब्ध",
            stableCode: "मौसम अनुकूल है। फसलों की सामान्य निगरानी रखें।",
            normalIrrig: "मिट्टी की नमी के अनुसार सामान्य रूप से पानी दें।",
            stableWarning: "मौसम सामान्य है। कीटनाशक छिड़काव या खाद के लिए उत्तम समय है।",
            cond_clear: "साफ आसमान", cond_cloudy: "आंशिक रूप से बादल", cond_foggy: "धुंधला मौसम",
            cond_drizzle: "हल्की बूंदाबांदी", cond_rainy: "बारिश", cond_snowy: "बर्फबारी", cond_stormy: "आंधी-तूफान",
            risk_high_fungal: "कवक (फंगस) का उच्च खतरा", risk_wet_alert: "नमी की चेतावनी",
            risk_pest_alert: "कीटों का खतरा", risk_stable: "कम बीमारी खतरा",
            irrig_delay: "सिंचाई टालें", irrig_evap: "तेज वाष्पीकरण",
            irrig_reduce: "सीमित सिंचाई", irrig_normal: "सामान्य सिंचाई",
            warn_wind: "तेज हवा की चेतावनी", warn_heat: "भीषण गर्मी की चेतावनी",
            warn_storm: "तूफान सुरक्षा अलर्ट", warn_cold: "पाले का खतरा", warn_safe: "सामान्य मौसम परिस्थितियां"
        },
        gu: {
            title: "હવામાન અને પાક સલાહ",
            humidity: "ભેજનું પ્રમાણ",
            rainChance: "વરસાદની શક્યતા",
            windSpeed: "પવનની ઝડપ",
            sunrise: "સૂર્યોદય",
            sunset: "સૂર્યાસ્ત",
            feelsLike: "આવું લાગે છે",
            pressure: "હવાનું દબાણ",
            visibility: "દૃશ્યતા",
            diseaseRisk: "રોગનું જોખમ એલર્ટ",
            irrigation: "પિયતની ભલામણ",
            warning: "હવામાન ચેતવણી",
            loading: "હવામાન અને કૃષિ સલાહ લોડ થઈ રહી છે...",
            error: "હવામાન માહિતી મેળવવામાં નિષ્ફળ. ઇન્ટરનેટ તપાસો અને ફરી પ્રયાસ કરો.",
            retry: "ફરી પ્રયાસ કરો",
            localFallbackBadge: "પૂર્વનિર્ધારિત સ્થાન",
            detectedLocationBadge: "લાઈવ લોકેશન",
            manualLocationBadge: "પસંદ કરેલ સ્થાન",
            localFallbackCityName: "આણંદ",
            changeLocation: "સ્થાન બદલો",
            searchPlaceholder: "ગામ, જિલ્લો અથવા શહેર ટાઇપ કરો...",
            searchBtn: "શોધો",
            mapInstruction: "નકશા પર ક્લિક કરેલ છે અથવા ઉપર શોધો",
            confirmLocation: "સ્થાન નક્કી કરો",
            cancelBtn: "રદ કરો",
            searching: "શોધ ચાલુ છે...",
            noResults: "કોઈ પરિણામ મળ્યા નથી. અલગ નામ અજમાવો.",
            unavailable: "અપ્રાપ્ય",
            stableCode: "હવામાન સ્થિર છે. પાકની સામાન્ય દેખરેખ ચાલુ રાખો.",
            normalIrrig: "જમીનની ભેજ ક્ષમતા મુજબ સામાન્ય પિયત આપવું.",
            stableWarning: "હવામાન સામાન્ય છે. દવા છાંટવા કે ખાતર આપવા માટે અનુકૂળ સમય છે.",
            cond_clear: "ચોખ્ખું આકાશ", cond_cloudy: "અંશતઃ વાદળછાયું", cond_foggy: "ધુમ્મસભર્યું વાતાવરણ",
            cond_drizzle: "ઝરમર વરસાદ", cond_rainy: "વરસાદી વાતાવરણ", cond_snowy: "બરફવર્ષા", cond_stormy: "ગાજવીજ સાથે વાવાઝોડું",
            risk_high_fungal: "ફૂગનું વધુ જોખમ", risk_wet_alert: "ભેજની ચેતવણી",
            risk_pest_alert: "જીવાત ઉપદ્રવ એલર્ટ", risk_stable: "ઓછું રોગ જોખમ",
            irrig_delay: "પિયત પાછું ઠેલો", irrig_evap: "ઝડપી બાષ્પીભવન",
            irrig_reduce: "હળવું પિયત આપો", irrig_normal: "સામાન્ય પિયત સમય",
            warn_wind: "અતિ ભારે પવન એલર્ટ", warn_heat: "લૂ અને ગરમીની ચેતવણી",
            warn_storm: "વાવાઝોડાથી બચાવ એલર્ટ", warn_cold: "ઠાર પડવાની ભીતિ", warn_safe: "સામાન્ય હવામાન સ્થિતિ"
        }
    };

    // ── State ───────────────────────────────────────────────────────────────
    let cachedWeather   = null;
    let locationStatus  = 'fallback'; // 'detected' | 'fallback' | 'manual'
    let lastCoords      = null;       // { lat, lon }
    let currentCityName = '';         // Localized display name
    let leafletMap      = null;       // Leaflet map instance
    let leafletMarker   = null;       // Selected marker on map
    let pendingCoords   = null;       // Coords chosen on map but not yet confirmed
    let leafletReady    = !!window.L; // true if Leaflet already loaded

    // FIX: Track in-flight fetch and initialization state to prevent duplicates
    let isFetching      = false;
    let isInitialized   = false;      // true after first full init (GPS asked)

    const DEFAULT_COORDS = { latitude: 22.5644, longitude: 72.9289 };

    // ── Helpers ─────────────────────────────────────────────────────────────
    function tr() {
        return weatherTranslations[window.currentLang || 'en'] || weatherTranslations.en;
    }

    function mapWeatherCode(id) {
        const code = parseInt(id, 10) || 800;
        if (code >= 200 && code < 300) return { key: 'cond_stormy',  emoji: '⛈️' };
        if (code >= 300 && code < 400) return { key: 'cond_drizzle', emoji: '🌦️' };
        if (code >= 500 && code < 600) return { key: 'cond_rainy',   emoji: '🌧️' };
        if (code >= 600 && code < 700) return { key: 'cond_snowy',   emoji: '❄️'  };
        if (code >= 700 && code < 800) return { key: 'cond_foggy',   emoji: '🌫️' };
        if (code === 800)              return { key: 'cond_clear',   emoji: '☀️'  };
        if (code > 800 && code < 900) return { key: 'cond_cloudy',  emoji: '⛅'  };
        return { key: 'cond_clear', emoji: '🌡️' };
    }

    function safe(val, fallback = '--') {
        if (val === null || val === undefined || val === '') return fallback;
        if (typeof val === 'number' && isNaN(val)) return fallback;
        return val;
    }

    function computeAdvisories(temp, humidity, rainChance, windSpeed, weatherCode, lang) {
        const t = weatherTranslations[lang] || weatherTranslations.en;
        let disease   = { status: 'success', title: t.risk_stable,  desc: t.stableCode   };
        let irrigation = { status: 'info',   title: t.irrig_normal, desc: t.normalIrrig  };
        let warning   = { status: 'success', title: t.warn_safe,    desc: t.stableWarning };

        if (humidity > 80 && temp >= 20 && temp <= 30) {
            disease.status = 'danger'; disease.title = t.risk_high_fungal;
            disease.desc = lang === 'gu'
                ? "⚠️ હવામાં ભેજ વધુ અને મધ્યમ તાપમાન (૨૦-૩૦°C) હોવાથી ફૂગના રોગો (જેમ કે પાન ના ટપકાં, સુકારો) નું જોખમ ઘણું વધારે છે. પાંદડા ચકાસો."
                : lang === 'hi'
                ? "⚠️ हवा में अधिक नमी और अनुकूल तापमान (20-30°C) के कारण फंगस जनित रोगों (जैसे झुलसा, टिक्का रोग) का भारी खतरा है। पत्तों की जांच करें।"
                : "⚠️ High humidity and warm temperatures (20-30°C) create high risk for fungal pathogens (Blight, Mildews). Inspect leaves for spots.";
        } else if (weatherCode >= 500 && weatherCode < 600) {
            disease.status = 'warning'; disease.title = t.risk_wet_alert;
            disease.desc = lang === 'gu'
                ? "🌧️ સતત ભીનાશથી બેક્ટેરિયલ રોગો અને કોહવારો ફેલાઈ શકે છે. મૂળિયાં પાસે પાણી ભરાઈ ન રહેવા દો."
                : lang === 'hi'
                ? "🌧️ लगातार नमी से बैक्टीरिया जनित बीमारियां और जड़ गलन फैल सकती है। खेत से पानी के निकास की व्यवस्था करें।"
                : "🌧️ Wet foliage promotes bacterial infections. Check soil drainage and prevent stagnant water near roots.";
        } else if (temp > 35 && humidity < 40) {
            disease.status = 'warning'; disease.title = t.risk_pest_alert;
            disease.desc = lang === 'gu'
                ? "🐜 ગરમ અને સૂકા વાતાવરણમાં મોલો-મશી, થ્રીપ્સ અને સફેદ માખી જેવી ચુસિયા જીવાતો વધે છે. લીમડાનું તેલ છાંટવું."
                : lang === 'hi'
                ? "🐜 गर्म और सूखे मौसम में रस चूसने वाले कीटों (थ्रिप्स, सफेद मक्खी) का हमला बढ़ सकता है। नीम के तेल का छिड़काव करें।"
                : "🐜 Hot & dry environments accelerate sucking pest lifecycles (Thrips, Whiteflies). Inspect leaf undersides.";
        }

        if (rainChance > 50 || (weatherCode >= 500 && weatherCode < 600)) {
            irrigation.status = 'warning'; irrigation.title = t.irrig_delay;
            irrigation.desc = lang === 'gu'
                ? "☔ ભારે વરસાદની શક્યતા હોવાથી હાલમાં પિયત આપવાનું બંધ રાખો. વધારાનું પાણી બહાર કાઢો."
                : lang === 'hi'
                ? "☔ भारी बारिश की संभावना के कारण अभी सिंचाई रोक दें। खेत में फालतू पानी जमा न होने दें।"
                : "☔ Strong rain chance detected. Delay scheduled irrigation to avoid water waste and root suffocation.";
        } else if (temp > 35) {
            irrigation.status = 'info'; irrigation.title = t.irrig_evap;
            irrigation.desc = lang === 'gu'
                ? "💧 વધુ ગરમીમાં બાષ્પીભવન વધી જાય છે. પિયત વહેલી સવારે અથવા સાંજે આપો."
                : lang === 'hi'
                ? "💧 तेज धूप और गर्मी में पानी तेजी से उड़ता है। सिंचाई केवल सुबह या शाम के ठंडे समय में ही करें।"
                : "💧 High temperature drives evaporation. Apply water during early morning or sunset hours to conserve soil moisture.";
        } else if (humidity > 85) {
            irrigation.status = 'success'; irrigation.title = t.irrig_reduce;
            irrigation.desc = lang === 'gu'
                ? "🌫️ હવામાં ભરપૂર ભેજના લીધે છોડ પાણી ઓછું ખેંચે છે. જમીન ચીકણી ન થાય તે માટે હળવું પિયત આપો."
                : lang === 'hi'
                ? "🌫️ हवा में पहले से अत्यधिक नमी है। जमीन में दलदल न बनने दें, केवल हल्की सिंचाई की ही आवश्यकता है।"
                : "🌫️ High ambient relative humidity limits plant transpiration. Keep irrigation light to avoid waterlogging.";
        }

        if (windSpeed > 22) {
            warning.status = 'danger'; warning.title = t.warn_wind;
            warning.desc = lang === 'gu'
                ? `💨 ભારે પવન (${windSpeed} km/h) ની શક્યતા. ઊભા પાકોને આધાર આપો અને કોઈ પણ પ્રકારની દવા છાંટવાનું ટાળો.`
                : lang === 'hi'
                ? `💨 तेज हवाएं (${windSpeed} किमी/घंटा) चलने के आसार हैं। फसल संरक्षण दवाओं का छिड़काव रोक दें और कमजोर फसलों को सहारा दें।`
                : `💨 Strong wind speeds of ${windSpeed} km/h. Avoid foliar sprays to prevent chemical drift; support fragile crops.`;
        } else if (temp > 40) {
            warning.status = 'danger'; warning.title = t.warn_heat;
            warning.desc = lang === 'gu'
                ? `🔥 અતિશય ગરમી (${temp}°C) નું મોજું. દેશી ખાતર કે મલ્ચિંગ વડે મૂળ ઢાંકો અને પશુધનને છાંયડે પાણી પીવડાવો.`
                : lang === 'hi'
                ? `🔥 भीषण गर्मी की चेतावनी (${temp}°C)। फसलों को बचाने के लिए गीली घास से मल्चिंग करें, और पशुओं को छाया में रखें।`
                : `🔥 Extreme heatwaves (${temp}°C) expected. Protect delicate root systems with organic mulch, and keep livestock shaded.`;
        } else if ((weatherCode >= 500 && weatherCode < 600) || (weatherCode >= 200 && weatherCode < 300)) {
            warning.status = 'danger'; warning.title = t.warn_storm;
            warning.desc = lang === 'gu'
                ? "⛈️ ગાજવીજ સાથે ભારે વરસાદ કે વાવાઝોડું. ખેતરોમાંથી પાણીના નિકાલની નીકો ખુલ્લી કરો. સુરક્ષિત જગ્યાએ આશરો લો."
                : lang === 'hi'
                ? "⛈️ तेज आंधी और भारी वर्षा की आशंका। खेतों में जल निकासी नालियों को खोलें। आकाशीय बिजली के समय पेड़ों के नीचे न खड़े हों।"
                : "⛈️ Severe storm alerts. Keep irrigation channels free of blockage and seek secure indoor shelter immediately.";
        } else if (temp < 10) {
            warning.status = 'warning'; warning.title = t.warn_cold;
            warning.desc = lang === 'gu'
                ? `❄️ અતિશય ઠંડી (${temp}°C) થી ઝાકળ કે ઠાર પડવાનું જોખમ. જમીનને હુંફાળી રાખવા સાંજે હળવું પિયત આપો.`
                : lang === 'hi'
                ? `❄️ शीतलहर की चेतावनी (${temp}°C)। पाला पड़ने का खतरा है। तापमान संतुलित रखने के लिए रात के समय हल्की सिंचाई करें।`
                : `❄️ Frost warning under low temperature (${temp}°C). Irrigate fields lightly overnight to help release heat.`;
        }

        return { disease, irrigation, warning };
    }

    // ── Location Picker Modal ────────────────────────────────────────────────
    function openLocationPicker() {
        const t = tr();
        // Remove existing modal if any
        document.getElementById('wlp-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.id = 'wlp-overlay';
        overlay.className = 'wlp-overlay';
        overlay.innerHTML = `
            <div class="wlp-modal">
                <div class="wlp-header">
                    <span class="wlp-title">🗺️ ${t.changeLocation}</span>
                    <button class="wlp-close-btn" id="wlp-close">✕</button>
                </div>
                <div class="wlp-search-row">
                    <input type="text" id="wlp-search-input" class="wlp-search-input"
                        placeholder="${t.searchPlaceholder}" autocomplete="off" />
                    <button class="wlp-search-btn" id="wlp-search-btn">${t.searchBtn}</button>
                </div>
                <div id="wlp-results" class="wlp-results" style="display:none;"></div>
                <div class="wlp-map-instruction">${t.mapInstruction}</div>
                <div id="wlp-map" class="wlp-map"></div>
                <div class="wlp-selected-label" id="wlp-selected-label" style="display:none;"></div>
                <div class="wlp-footer">
                    <button class="wlp-cancel-btn" id="wlp-cancel">${t.cancelBtn}</button>
                    <button class="wlp-confirm-btn" id="wlp-confirm" disabled>${t.confirmLocation}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Init Leaflet map — wait until Leaflet JS is fully loaded
        if (leafletReady) {
            setTimeout(() => initLeafletMap(), 50);
        } else {
            const mapDiv = overlay.querySelector('#wlp-map');
            if (mapDiv) mapDiv.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-light);font-size:0.95rem;">🗺️ Loading map...</div>';
            const waitForLeaflet = setInterval(() => {
                if (window.L) {
                    leafletReady = true;
                    clearInterval(waitForLeaflet);
                    if (document.getElementById('wlp-map')) initLeafletMap();
                }
            }, 100);
        }

        // Event bindings
        document.getElementById('wlp-close').addEventListener('click', closeLocationPicker);
        document.getElementById('wlp-cancel').addEventListener('click', closeLocationPicker);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLocationPicker(); });
        document.getElementById('wlp-search-btn').addEventListener('click', doSearch);
        document.getElementById('wlp-search-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doSearch();
        });
        document.getElementById('wlp-confirm').addEventListener('click', confirmPendingLocation);
    }

    function closeLocationPicker() {
        document.getElementById('wlp-overlay')?.remove();
        if (leafletMap) { leafletMap.remove(); leafletMap = null; leafletMarker = null; }
        pendingCoords = null;
    }

    function initLeafletMap() {
        const centerLat = lastCoords ? lastCoords.lat : DEFAULT_COORDS.latitude;
        const centerLon = lastCoords ? lastCoords.lon : DEFAULT_COORDS.longitude;

        leafletMap = L.map('wlp-map', { zoomControl: true }).setView([centerLat, centerLon], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(leafletMap);

        if (lastCoords) {
            leafletMarker = L.marker([lastCoords.lat, lastCoords.lon]).addTo(leafletMap);
        }

        leafletMap.on('click', (e) => {
            const { lat, lng } = e.latlng;
            setPendingCoords(lat, lng, null);
        });
    }

    function setPendingCoords(lat, lon, cityName) {
        pendingCoords = { lat, lon, cityName };

        if (leafletMap) {
            if (leafletMarker) leafletMarker.setLatLng([lat, lon]);
            else leafletMarker = L.marker([lat, lon]).addTo(leafletMap);
            leafletMap.setView([lat, lon], Math.max(leafletMap.getZoom(), 10));
        }

        const label = document.getElementById('wlp-selected-label');
        if (label) {
            label.style.display = 'block';
            label.innerHTML = cityName
                ? `📍 <strong>${cityName}</strong>`
                : `📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        }

        const confirmBtn = document.getElementById('wlp-confirm');
        if (confirmBtn) confirmBtn.disabled = false;
    }

    async function doSearch() {
        const input = document.getElementById('wlp-search-input');
        const query = input ? input.value.trim() : '';
        if (!query) return;

        const t = tr();
        const searchBtn = document.getElementById('wlp-search-btn');
        const resultsDiv = document.getElementById('wlp-results');

        searchBtn.disabled = true;
        searchBtn.textContent = t.searching;
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `<div class="wlp-result-loading">🔍 ${t.searching}</div>`;

        try {
            const lang = window.currentLang || 'en';
            const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&lang=${lang}`);
            if (!res.ok) throw new Error('Geocode API error');
            const data = await res.json();

            // Handle both array (raw Nominatim) and formatted responses
            const items = Array.isArray(data) ? data : (data.results || []);

            if (!items || items.length === 0) {
                resultsDiv.innerHTML = `<div class="wlp-no-results">⚠️ ${t.noResults}</div>`;
            } else {
                resultsDiv.innerHTML = items.slice(0, 5).map((item, i) => {
                    // Use short name first, then first part of display_name, then full display_name
                    const shortName = item.name || (item.display_name ? item.display_name.split(',')[0].trim() : query);
                    const subName = item.display_name || '';
                    const latVal = item.lat;
                    const lonVal = item.lon;
                    return `<div class="wlp-result-item" data-idx="${i}" data-lat="${latVal}" data-lon="${lonVal}" data-name="${encodeURIComponent(shortName)}">
                        <div class="wlp-result-name">📍 ${shortName}</div>
                        <div class="wlp-result-sub">${subName.length > 80 ? subName.substring(0, 80) + '…' : subName}</div>
                    </div>`;
                }).join('');

                resultsDiv.querySelectorAll('.wlp-result-item').forEach(el => {
                    el.addEventListener('click', () => {
                        const lat = parseFloat(el.dataset.lat);
                        const lon = parseFloat(el.dataset.lon);
                        const name = decodeURIComponent(el.dataset.name);
                        if (!isNaN(lat) && !isNaN(lon)) {
                            setPendingCoords(lat, lon, name);
                            resultsDiv.style.display = 'none';
                        }
                    });
                });
            }
        } catch (e) {
            console.error('[Weather] Geocode search error:', e);
            resultsDiv.innerHTML = `<div class="wlp-no-results">⚠️ ${t.noResults}</div>`;
        }

        searchBtn.disabled = false;
        searchBtn.textContent = t.searchBtn;
    }

    async function confirmPendingLocation() {
        if (!pendingCoords) return;
        const { lat, lon, cityName } = pendingCoords;

        if (isNaN(lat) || isNaN(lon)) {
            console.error('[Weather] Invalid coordinates in pendingCoords');
            return;
        }

        locationStatus = 'manual';
        currentCityName = cityName || '';

        closeLocationPicker();
        lastCoords = { lat, lon };

        // Clear sessionStorage so fresh fetch is made
        sessionStorage.removeItem('krishiCachedWeather');
        await fetchWeatherForCoords(lat, lon);
    }

    // ── Weather Rendering ────────────────────────────────────────────────────
    function renderWeatherCard() {
        const container = document.getElementById('weather-section');
        if (!container) return;

        const t = tr();

        if (!cachedWeather) {
            container.innerHTML = `
                <div class="weather-card">
                    <div class="weather-loading-wrapper">
                        <div class="weather-loading-spinner"></div>
                        <div class="weather-loading-text">${t.loading}</div>
                    </div>
                </div>`;
            return;
        }

        if (cachedWeather.error) {
            container.innerHTML = `
                <div class="weather-card">
                    <div class="weather-error-wrapper">
                        <div class="weather-error-icon">⚠️</div>
                        <div class="weather-error-msg">${t.error}</div>
                        <button class="weather-retry-btn" id="weather-retry-btn">${t.retry}</button>
                    </div>
                </div>`;
            document.getElementById('weather-retry-btn')?.addEventListener('click', () => {
                cachedWeather = null;
                sessionStorage.removeItem('krishiCachedWeather');
                fetchWeatherForCoords(
                    lastCoords ? lastCoords.lat : DEFAULT_COORDS.latitude,
                    lastCoords ? lastCoords.lon : DEFAULT_COORDS.longitude
                );
            });
            return;
        }

        const w = cachedWeather;
        const condition = mapWeatherCode(w.weatherCode);
        const conditionName = t[condition.key] || condition.key;
        const lang = window.currentLang || 'en';

        const badgeText = locationStatus === 'detected' ? t.detectedLocationBadge
                        : locationStatus === 'manual'   ? t.manualLocationBadge
                        : t.localFallbackBadge;

        const displayCountry = (w.country && w.country.trim()) ? `, ${w.country.trim()}` : '';
        const displayCity = (safe(w.cityName) !== '--' ? w.cityName
                          : (currentCityName || t.localFallbackCityName)) + displayCountry;

        const tempVal       = safe(w.temp)       !== '--' ? `${Math.round(w.temp)}°C` : '--';
        const humidityVal   = safe(w.humidity)   !== '--' ? `${w.humidity}%` : '--';
        const rainVal       = safe(w.rainChance) !== '--' ? `${w.rainChance}%` : '--';
        const windVal       = safe(w.windSpeed)  !== '--' ? `${Math.round(w.windSpeed * 10) / 10} km/h` : '--';
        const sunriseVal    = safe(w.sunrise, t.unavailable);
        const sunsetVal     = safe(w.sunset, t.unavailable);
        const feelsLikeVal  = safe(w.feels_like) !== '--' ? `${Math.round(w.feels_like)}°C` : '--';
        const pressureVal   = safe(w.pressure)   !== '--' ? `${w.pressure} hPa` : '--';
        const visibilityVal = safe(w.visibility) !== '--' ? `${w.visibility} km` : '--';

        const advisories = computeAdvisories(
            parseFloat(w.temp) || 25,
            parseFloat(w.humidity) || 50,
            parseFloat(w.rainChance) || 0,
            parseFloat(w.windSpeed) || 0,
            parseInt(w.weatherCode, 10) || 800,
            lang
        );

        container.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">
                    <div class="weather-title-group">
                        <h4 class="weather-card-title">
                            🌾 ${t.title}
                            <span class="weather-location-badge">📍 ${badgeText}: ${displayCity}</span>
                        </h4>
                        <div class="weather-location-actions">
                            <button class="weather-change-loc-btn" id="weather-change-loc-btn">
                                🗺️ ${t.changeLocation}
                            </button>
                        </div>
                        <span class="weather-subtitle">${conditionName}</span>
                    </div>
                    <button class="weather-refresh-btn" id="weather-refresh-btn" title="Refresh">🔄</button>
                </div>

                <div class="weather-main-grid">
                    <div class="weather-info-box">
                        <div class="weather-large-emoji">${condition.emoji}</div>
                        <div class="weather-temp-details">
                            <span class="weather-temp-value">${tempVal}</span>
                            <span class="weather-desc-label">${conditionName}</span>
                        </div>
                    </div>
                    <div class="weather-details-list">
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">💧</span>
                            <span class="weather-detail-val">${humidityVal}</span>
                            <span class="weather-detail-lbl">${t.humidity}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">☔</span>
                            <span class="weather-detail-val">${rainVal}</span>
                            <span class="weather-detail-lbl">${t.rainChance}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">💨</span>
                            <span class="weather-detail-val">${windVal}</span>
                            <span class="weather-detail-lbl">${t.windSpeed}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">🌡️</span>
                            <span class="weather-detail-val">${feelsLikeVal}</span>
                            <span class="weather-detail-lbl">${t.feelsLike}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">⏲️</span>
                            <span class="weather-detail-val">${pressureVal}</span>
                            <span class="weather-detail-lbl">${t.pressure}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">👁️</span>
                            <span class="weather-detail-val">${visibilityVal}</span>
                            <span class="weather-detail-lbl">${t.visibility}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">🌅</span>
                            <span class="weather-detail-val">${sunriseVal}</span>
                            <span class="weather-detail-lbl">${t.sunrise}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">🌇</span>
                            <span class="weather-detail-val">${sunsetVal}</span>
                            <span class="weather-detail-lbl">${t.sunset}</span>
                        </div>
                    </div>
                </div>

                <div class="weather-insights-container">
                    <div class="weather-insight-card ${advisories.disease.status}">
                        <div class="weather-insight-header">🐛 ${t.diseaseRisk}</div>
                        <div class="weather-insight-desc"><strong>${advisories.disease.title}:</strong> ${advisories.disease.desc}</div>
                    </div>
                    <div class="weather-insight-card ${advisories.irrigation.status}">
                        <div class="weather-insight-header">💧 ${t.irrigation}</div>
                        <div class="weather-insight-desc"><strong>${advisories.irrigation.title}:</strong> ${advisories.irrigation.desc}</div>
                    </div>
                    <div class="weather-insight-card ${advisories.warning.status}">
                        <div class="weather-insight-header">⚠️ ${t.warning}</div>
                        <div class="weather-insight-desc"><strong>${advisories.warning.title}:</strong> ${advisories.warning.desc}</div>
                    </div>
                </div>
            </div>`;

        document.getElementById('weather-refresh-btn')?.addEventListener('click', () => {
            cachedWeather = null;
            sessionStorage.removeItem('krishiCachedWeather');
            fetchWeatherForCoords(
                lastCoords ? lastCoords.lat : DEFAULT_COORDS.latitude,
                lastCoords ? lastCoords.lon : DEFAULT_COORDS.longitude
            );
        });

        document.getElementById('weather-change-loc-btn')?.addEventListener('click', openLocationPicker);
    }

    // ── Data Fetching ────────────────────────────────────────────────────────
    async function fetchWeatherForCoords(lat, lon) {
        // FIX: Prevent duplicate in-flight requests
        if (isFetching) return;
        if (isNaN(lat) || isNaN(lon)) {
            console.error('[Weather] Invalid coordinates:', lat, lon);
            cachedWeather = { error: true };
            renderWeatherCard();
            return;
        }

        isFetching = true;
        lastCoords = { lat, lon };
        cachedWeather = null;
        renderWeatherCard(); // show loading spinner

        try {
            const lang = window.currentLang || 'en';
            const url = `/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&lang=${encodeURIComponent(lang)}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Weather API returned HTTP ${res.status}`);
            }

            const data = await res.json();

            if (!data || !data.success || !data.data) {
                throw new Error('Invalid API response structure');
            }

            const w = data.data;

            // Validate all critical fields — never store undefined
            cachedWeather = {
                temp:        (w.temp !== null && w.temp !== undefined)       ? parseFloat(w.temp)       : null,
                humidity:    (w.humidity !== null && w.humidity !== undefined) ? parseFloat(w.humidity)   : null,
                weatherCode: (w.weatherCode !== null && w.weatherCode !== undefined) ? parseInt(w.weatherCode, 10) : 800,
                windSpeed:   (w.windSpeed !== null && w.windSpeed !== undefined) ? parseFloat(w.windSpeed) : null,
                rainChance:  (w.rainChance !== null && w.rainChance !== undefined) ? parseFloat(w.rainChance) : 0,
                cityName:    (w.cityName && w.cityName.trim()) ? w.cityName.trim()
                             : (currentCityName || tr().localFallbackCityName),
                sunrise:     w.sunrise || null,
                sunset:      w.sunset || null,
                feels_like:  (w.feels_like !== null && w.feels_like !== undefined) ? parseFloat(w.feels_like) : null,
                pressure:    (w.pressure !== null && w.pressure !== undefined)     ? parseInt(w.pressure, 10)  : null,
                visibility:  (w.visibility !== null && w.visibility !== undefined) ? parseFloat(w.visibility) : null,
                country:     w.country || null
            };

            // Persist to sessionStorage for same-session cache
            try {
                sessionStorage.setItem('krishiCachedWeather', JSON.stringify({
                    cachedWeather,
                    lastCoords,
                    locationStatus
                }));
            } catch (storageErr) {
                // sessionStorage full or unavailable — non-fatal
            }

        } catch (err) {
            console.error('[Weather] Fetch error:', err.message || err);
            cachedWeather = { error: true };
        } finally {
            isFetching = false;
        }

        renderWeatherCard();
    }

    // ── Initialization ───────────────────────────────────────────────────────
    function initWeather() {
        if (!document.getElementById('weather-section')) return;

        // Load Leaflet CSS + JS dynamically (non-blocking)
        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }
        if (!window.L && !document.getElementById('leaflet-js')) {
            const script = document.createElement('script');
            script.id = 'leaflet-js';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => { leafletReady = true; };
            document.head.appendChild(script);
        }

        // FIX: If already initialized and we have valid cached data, just re-render
        // This prevents duplicate GPS requests when user navigates back to weather
        if (isInitialized && cachedWeather && !cachedWeather.error) {
            renderWeatherCard();
            return;
        }

        // FIX: Don't start new init if a fetch is in progress
        if (isFetching) return;

        // Try restoring from sessionStorage
        try {
            const saved = sessionStorage.getItem('krishiCachedWeather');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.cachedWeather && !parsed.cachedWeather.error) {
                    cachedWeather = parsed.cachedWeather;
                    lastCoords    = parsed.lastCoords;
                    locationStatus = parsed.locationStatus || 'fallback';
                    isInitialized = true;
                    renderWeatherCard();
                    return; // Use cached — no GPS needed
                }
            }
        } catch (e) {
            console.warn('[Weather] sessionStorage restore failed:', e);
            sessionStorage.removeItem('krishiCachedWeather');
        }

        // No cache — show loading and request location
        isInitialized = true;
        renderWeatherCard(); // show spinner

        if (navigator.geolocation) {
            try {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        locationStatus = 'detected';
                        fetchWeatherForCoords(pos.coords.latitude, pos.coords.longitude);
                    },
                    (err) => {
                        console.warn('[Weather] Geolocation failed (code ' + err.code + '), using fallback location.');
                        locationStatus = 'fallback';
                        fetchWeatherForCoords(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);
                        // Show manual city search modal automatically
                        openLocationPicker();
                    },
                    { timeout: 2500, maximumAge: 120000, enableHighAccuracy: false }
                );
            } catch (geoErr) {
                console.warn('[Weather] Geolocation threw exception synchronously, using fallback location:', geoErr);
                locationStatus = 'fallback';
                fetchWeatherForCoords(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);
                // Show manual city search modal automatically
                openLocationPicker();
            }
        } else {
            locationStatus = 'fallback';
            fetchWeatherForCoords(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);
            // Show manual city search modal automatically
            openLocationPicker();
        }
    }

    // ── Language Change Handler ──────────────────────────────────────────────
    // FIX: Only re-render (or re-fetch) when weather is visible.
    // Do NOT call initWeather() here — that would trigger duplicate GPS requests.
    window.addEventListener('languageChanged', () => {
        const weatherSection = document.getElementById('weather-section');
        if (!weatherSection || weatherSection.style.display === 'none') return;

        if (cachedWeather && !cachedWeather.error) {
            // We have data — just re-render with new language strings
            // Also update city name to localized version via a fresh fetch
            const coords = lastCoords || { lat: DEFAULT_COORDS.latitude, lon: DEFAULT_COORDS.longitude };
            sessionStorage.removeItem('krishiCachedWeather');
            cachedWeather = null;
            currentCityName = '';
            fetchWeatherForCoords(coords.lat, coords.lon);
        } else if (!isFetching) {
            // No data yet — just re-render the current state (loading or error)
            renderWeatherCard();
        }
    });

    // ── Entry Point ──────────────────────────────────────────────────────────
    if (window.__weatherAutoInit === false) {
        // Controlled init: app.js will call window.__initWeather() when needed
        window.__initWeather = initWeather;

        // FIX: Handle race condition where weather.js loads after app.js completes initialization
        const initIfOnWeatherPage = () => {
            if (window.location.pathname.includes('weather.html')) {
                initWeather();
            }
        };

        if (window.appData) {
            initIfOnWeatherPage();
        } else {
            window.addEventListener('appReady', initIfOnWeatherPage);
        }
    } else {
        // Standalone auto-init
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWeather);
        } else {
            initWeather();
        }
    }

})();
