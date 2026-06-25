/**
 * Krishi-Cure Pro - Smart Weather & Agriculture Advisory System
 * - Real-time weather via backend proxy (Open-Meteo fallback)
 * - Interactive Leaflet map for location picking
 * - Text search (village/district/city) via backend-proxied Nominatim
 * - Localized city names in selected language (EN/HI/GU)
 */

(function () {
    // ── Translation Dictionary ──────────────────────────────────────────────
    const weatherTranslations = {
        en: {
            title: "Weather Care Advisory",
            humidity: "Humidity",
            rainChance: "Rain Chance",
            windSpeed: "Wind Speed",
            diseaseRisk: "Disease Risk Alert",
            irrigation: "Irrigation Suggestion",
            warning: "Weather Warning",
            loading: "Fetching live weather and agriculture advisory...",
            error: "Failed to load weather data. Please try again.",
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
            diseaseRisk: "रोग का खतरा अलर्ट",
            irrigation: "सिंचाई का सुझाव",
            warning: "मौसम चेतावनी",
            loading: "लाइव मौसम और कृषि सलाह लोड की जा रही है...",
            error: "मौसम डेटा लोड करने में विफल। कृपया पुन: प्रयास करें।",
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
            diseaseRisk: "રોગનું જોખમ એલર્ટ",
            irrigation: "પિયતની ભલામણ",
            warning: "હવામાન ચેતવણી",
            loading: "હવામાન અને કૃષિ સલાહ લોડ થઈ રહી છે...",
            error: "હવામાન માહિતી મેળવવામાં નિષ્ફળતા. ફરી પ્રયાસ કરો.",
            retry: "ફરી પ્રયાસ કરો",
            localFallbackBadge: "પૂર્વનિર્ધારિત સ્થાન",
            detectedLocationBadge: "લાઈવ લોકેશન",
            manualLocationBadge: "પસંદ કરેલ સ્થાન",
            localFallbackCityName: "આણંદ",
            changeLocation: "સ્થાન બદલો",
            searchPlaceholder: "ગામ, જિલ્લો અથવા શહેર ટાઇપ કરો...",
            searchBtn: "શોધો",
            mapInstruction: "નકશા પર ક્લિક કરો અથવા ઉપર શોધો",
            confirmLocation: "સ્થાન નક્કી કરો",
            cancelBtn: "રદ કરો",
            searching: "શોધ ચાલુ છે...",
            noResults: "કોઈ પરિણામ મળ્યા નથી. અલગ નામ અજમાવો.",
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

    const DEFAULT_COORDS = { latitude: 22.5644, longitude: 72.9289 };

    // ── Helpers ─────────────────────────────────────────────────────────────
    function tr() {
        return weatherTranslations[window.currentLang || 'en'] || weatherTranslations.en;
    }

    function mapWeatherCode(id) {
        if (id >= 200 && id < 300) return { key: 'cond_stormy',  emoji: '⛈️' };
        if (id >= 300 && id < 400) return { key: 'cond_drizzle', emoji: '🌦️' };
        if (id >= 500 && id < 600) return { key: 'cond_rainy',   emoji: '🌧️' };
        if (id >= 600 && id < 700) return { key: 'cond_snowy',   emoji: '❄️' };
        if (id >= 700 && id < 800) return { key: 'cond_foggy',   emoji: '🌫️' };
        if (id === 800)             return { key: 'cond_clear',   emoji: '☀️' };
        if (id > 800 && id < 900)  return { key: 'cond_cloudy',  emoji: '⛅' };
        return { key: 'cond_clear', emoji: '🌡️' };
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
            setTimeout(() => initLeafletMap(t), 50);
        } else {
            // Show a brief loading indicator inside the map div while Leaflet loads
            const mapDiv = overlay.querySelector('#wlp-map');
            if (mapDiv) mapDiv.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-light);font-size:0.95rem;">🗺️ Loading map...</div>';
            const waitForLeaflet = setInterval(() => {
                if (window.L) {
                    leafletReady = true;
                    clearInterval(waitForLeaflet);
                    if (document.getElementById('wlp-map')) initLeafletMap(t);
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

    function initLeafletMap(t) {
        const centerLat = lastCoords ? lastCoords.lat : DEFAULT_COORDS.latitude;
        const centerLon = lastCoords ? lastCoords.lon : DEFAULT_COORDS.longitude;

        leafletMap = L.map('wlp-map', { zoomControl: true }).setView([centerLat, centerLon], 7);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(leafletMap);

        // If there's an existing location, show a marker
        if (lastCoords) {
            leafletMarker = L.marker([lastCoords.lat, lastCoords.lon]).addTo(leafletMap);
        }

        // Click on map to pick location
        leafletMap.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            setPendingCoords(lat, lng, null); // city name resolved after confirm
        });
    }

    function setPendingCoords(lat, lon, cityName) {
        pendingCoords = { lat, lon, cityName };

        // Update marker
        if (leafletMap) {
            if (leafletMarker) leafletMarker.setLatLng([lat, lon]);
            else leafletMarker = L.marker([lat, lon]).addTo(leafletMap);
            leafletMap.setView([lat, lon], Math.max(leafletMap.getZoom(), 10));
        }

        // Show label
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
            const data = await res.json();

            if (!data || data.length === 0) {
                resultsDiv.innerHTML = `<div class="wlp-no-results">⚠️ ${t.noResults}</div>`;
            } else {
                resultsDiv.innerHTML = data.slice(0, 5).map((item, i) => {
                    const name = item.localName || item.display_name || item.name || query;
                    const sub = item.display_name || '';
                    return `<div class="wlp-result-item" data-idx="${i}" data-lat="${item.lat}" data-lon="${item.lon}" data-name="${encodeURIComponent(name)}">
                        <div class="wlp-result-name">📍 ${name}</div>
                        <div class="wlp-result-sub">${sub.substring(0, 80)}...</div>
                    </div>`;
                }).join('');

                resultsDiv.querySelectorAll('.wlp-result-item').forEach(el => {
                    el.addEventListener('click', () => {
                        const lat = parseFloat(el.dataset.lat);
                        const lon = parseFloat(el.dataset.lon);
                        const name = decodeURIComponent(el.dataset.name);
                        setPendingCoords(lat, lon, name);
                        resultsDiv.style.display = 'none';
                    });
                });
            }
        } catch (e) {
            resultsDiv.innerHTML = `<div class="wlp-no-results">⚠️ ${t.error}</div>`;
        }

        searchBtn.disabled = false;
        searchBtn.textContent = t.searchBtn;
    }

    async function confirmPendingLocation() {
        if (!pendingCoords) return;
        const { lat, lon, cityName } = pendingCoords;

        locationStatus = 'manual';
        currentCityName = ''; // will be resolved by backend reverse geocode

        closeLocationPicker();
        lastCoords = { lat, lon };

        // If we have a city name from search results, use it directly
        if (cityName) {
            currentCityName = cityName;
            await fetchWeatherForCoords(lat, lon);
        } else {
            // Came from map click — backend will reverse-geocode
            await fetchWeatherForCoords(lat, lon);
        }
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

        let badgeText = locationStatus === 'detected' ? t.detectedLocationBadge
                      : locationStatus === 'manual'   ? t.manualLocationBadge
                      : t.localFallbackBadge;

        const displayCity = w.cityName || currentCityName || t.localFallbackCityName;
        const advisories  = computeAdvisories(w.temp, w.humidity, w.rainChance, w.windSpeed, w.weatherCode, window.currentLang || 'en');

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
                            <span class="weather-temp-value">${Math.round(w.temp)}°C</span>
                            <span class="weather-desc-label">${conditionName}</span>
                        </div>
                    </div>
                    <div class="weather-details-list">
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">💧</span>
                            <span class="weather-detail-val">${w.humidity}%</span>
                            <span class="weather-detail-lbl">${t.humidity}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">☔</span>
                            <span class="weather-detail-val">${w.rainChance}%</span>
                            <span class="weather-detail-lbl">${t.rainChance}</span>
                        </div>
                        <div class="weather-detail-item">
                            <span class="weather-detail-icon">💨</span>
                            <span class="weather-detail-val">${Math.round(w.windSpeed * 10) / 10} km/h</span>
                            <span class="weather-detail-lbl">${t.windSpeed}</span>
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
            fetchWeatherForCoords(
                lastCoords ? lastCoords.lat : DEFAULT_COORDS.latitude,
                lastCoords ? lastCoords.lon : DEFAULT_COORDS.longitude
            );
        });

        document.getElementById('weather-change-loc-btn')?.addEventListener('click', openLocationPicker);
    }

    // ── Data Fetching ────────────────────────────────────────────────────────
    /**
     * Fetch weather + localized city name via backend (no CORS issues)
     */
    async function fetchWeatherForCoords(lat, lon) {
        lastCoords = { lat, lon };
        cachedWeather = null;
        renderWeatherCard(); // show loading

        try {
            const lang = window.currentLang || 'en';
            const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&lang=${lang}`);
            if (!res.ok) throw new Error('Weather API error');
            const data = await res.json();

            if (!data || !data.success || !data.data) {
                throw new Error('Invalid weather response');
            }

            const w = data.data;
            const cityName = w.cityName || currentCityName || tr().localFallbackCityName;

            cachedWeather = {
                temp:        w.temp,
                humidity:    w.humidity,
                weatherCode: w.weatherCode,
                windSpeed:   w.windSpeed,
                rainChance:  w.rainChance,
                cityName
            };

            // Save to sessionStorage
            sessionStorage.setItem('krishiCachedWeather', JSON.stringify({
                cachedWeather,
                lastCoords,
                locationStatus
            }));
        } catch (e) {
            console.error('Weather fetch error:', e);
            cachedWeather = { error: true };
        }

        renderWeatherCard();
    }

    // ── Initialization ───────────────────────────────────────────────────────
    function initWeather() {
        if (!document.getElementById('weather-section')) return;

        // Load Leaflet CSS + JS dynamically (non-blocking, tracked via leafletReady flag)
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

        // Try restoring from sessionStorage
        try {
            const saved = sessionStorage.getItem('krishiCachedWeather');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.cachedWeather && !parsed.cachedWeather.error) {
                    cachedWeather = parsed.cachedWeather;
                    lastCoords = parsed.lastCoords;
                    locationStatus = parsed.locationStatus;
                    renderWeatherCard();
                    return; // Skip GPS detection since we have active cache
                }
            }
        } catch (e) {
            console.error("Failed to restore weather from sessionStorage:", e);
        }

        // Show loading spinner immediately — don't wait for GPS
        renderWeatherCard();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    locationStatus = 'detected';
                    fetchWeatherForCoords(pos.coords.latitude, pos.coords.longitude);
                },
                () => {
                    locationStatus = 'fallback';
                    fetchWeatherForCoords(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);
                },
                { timeout: 7000, maximumAge: 60000 }
            );
        } else {
            locationStatus = 'fallback';
            fetchWeatherForCoords(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);
        }
    }

    // On language change: re-fetch with same coords (backend returns localized name)
    window.addEventListener('languageChanged', () => {
        cachedWeather = null;
        currentCityName = '';
        if (lastCoords) {
            fetchWeatherForCoords(lastCoords.lat, lastCoords.lon);
        } else {
            renderWeatherCard();
        }
    });

    if (window.__weatherAutoInit === false) {
    window.__initWeather = initWeather;
} else {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWeather);
    } else {
        initWeather();
    }
}

})();
