/* ================================================================
   KRISHI-CURE PRO — Scrolling AI Ticker System v2.0
   ----------------------------------------------------------------
   Replaces warning banner with a professional, multilingual, continuous
   scrolling AI Information Ticker below the navbar.
   ================================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. MESSAGE BANK — All languages
       ---------------------------------------------------------- */
    const MESSAGES = {
        en: [
            '🤖 Krishi Cure AI provides AI-assisted crop disease analysis based on uploaded images and selected symptoms.',
            'ℹ️ Upload clear images of affected leaves, stems, fruits, or roots for better diagnosis accuracy.',
            '🌱 Combining crop selection, symptoms, and images improves prediction quality.',
            'ℹ️ AI predictions are decision-support recommendations and should not be considered a final agricultural diagnosis.',
            '⚠️ If the confidence score is low or the disease appears severe, consult your nearest Agriculture Officer or Plant Pathology Expert.',
            '⚠️ For major crop damage, rapidly spreading diseases, or large-scale infections, seek expert agricultural assistance immediately.',
            '🌱 Follow proper irrigation, fertilizer, and crop management practices for healthier crops.',
            'ℹ️ Weather conditions may influence disease spread and treatment recommendations.',
            '🤖 Treatment recommendations are generated using AI knowledge and standard agricultural practices.',
            'ℹ️ The platform supports English, Hindi, and Gujarati for better accessibility.'
        ],
        hi: [
            '🤖 कृषि क्योर एआई अपलोड की गई छवियों और चयनित लक्षणों के आधार पर एआई-सहायता प्राप्त फसल रोग विश्लेषण प्रदान करता है।',
            'ℹ️ बेहतर निदान सटीकता के लिए प्रभावित पत्तियों, तनों, फलों या जड़ों की स्पष्ट तस्वीरें अपलोड करें।',
            '🌱 फसल चयन, लक्षण और छवियों को मिलाने से भविष्यवाणी की गुणवत्ता में सुधार होता है।',
            'ℹ️ एआई भविष्यवाणियां निर्णय-समर्थन सिफारिशें हैं और इन्हें अंतिम कृषि निदान नहीं माना जाना चाहिए।',
            '⚠️ यदि विश्वास स्कोर कम है या बीमारी गंभीर लगती है, तो अपने निकटतम कृषि अधिकारी या पादप रोग विशेषज्ञ से परामर्श करें।',
            '⚠️ फसल के बड़े नुकसान, तेजी से फैलने वाली बीमारियों या बड़े पैमाने पर संक्रमण के लिए, तुरंत विशेषज्ञ कृषि सहायता लें।',
            '🌱 स्वस्थ फसलों के लिए उचित सिंचाई, उर्वरक और फसल प्रबंधन प्रथाओं का पालन करें।',
            'ℹ️ मौसम की स्थिति रोग के प्रसार और उपचार की सिफारिशों को प्रभावित कर सकती है।',
            '🤖 उपचार की सिफारिशें एआई ज्ञान और मानक कृषि प्रथाओं का उपयोग करके उत्पन्न की जाती हैं।',
            'ℹ️ बेहतर पहुंच के लिए मंच अंग्रेजी, हिंदी और गुजराती का समर्थन करता है।'
        ],
        gu: [
            '🤖 કૃષિ ક્યોર એઆઈ અપલોડ કરેલી છબીઓ અને પસંદ કરેલા લક્ષણોના આધારે એઆઈ-સહાયિત પાક રોગ વિશ્લેષણ પ્રદાન કરે છે.',
            'ℹ️ વધુ સારી નિદાન સચોટતા માટે અસરગ્રસ્ત પાંદડા, દાંડી, ફળો અથવા મૂળની સ્પષ્ટ છબીઓ અપલોડ કરો.',
            '🌱 પાકની પસંદગી, લક્ષણો અને છબીઓનું સંયોજન અનુમાનની ગુણવત્તામાં સુધારો કરે છે.',
            'ℹ️ એઆઈ અનુમાનો નિર્ણય-સમર્થન ભલામણો છે અને તેને અંતિમ કૃષિ નિદાન ગણવું જોઈએ નહીં.',
            '⚠️ જો આત્મવિશ્વાસ સ્કોર ઓછો હોય અથવા રોગ ગંભીર જણાય, તો તમારા નજીકના કૃષિ અધિકારી અથવા પ્લાન્ટ પેથોલોજી નિષ્ણાતની સલાહ લો.',
            '⚠️ પાકના મોટા નુકસાન, ઝડપથી ફેલાતા રોગો અથવા મોટા પાયે ચેપ માટે, તાત્કાલિક નિષ્ણાત કૃષિ સહાય મેળવો.',
            '🌱 તંદુરસ્ત પાક માટે યોગ્ય પિયત, ખાતર અને પાક વ્યવસ્થાપન પદ્ધતિઓ અનુસરો.',
            'ℹ️ હવામાનની પરિસ્થિતિઓ રોગના ફેલાવા અને સારવારની ભલામણોને અસર કરી શકે છે.',
            '🤖 સારવારની ભલામણો એઆઈ જ્ઞાન અને પ્રમાણભૂત કૃષિ પદ્ધતિઓનો ઉપયોગ કરીને જનરેટ કરવામાં આવે છે.',
            'ℹ️ વધુ સારી સુલભતા માટે પ્લેટફોર્મ અંગ્રેજી, હિન્દી અને ગુજરાતી ભાષાઓને સપોર્ટ કરે છે.'
        ]
    };

    const LOADING_MESSAGES = {
        en: 'Loading application...',
        hi: 'एप्लिकेशन लोड हो रहा है...',
        gu: 'એપ્લિકેશન લોડ થઈ रही है...'
    };

    /* ----------------------------------------------------------
       2. HELPERS
       ---------------------------------------------------------- */
    function getLang() {
        return window.currentLang || localStorage.getItem('krishiLang') || 'en';
    }

    /* ----------------------------------------------------------
       3. INITIAL LOADING STATE
       ---------------------------------------------------------- */
    function initLoadingState() {
        var el = document.getElementById('warning_banner');
        if (!el) return;

        var lang = getLang();
        var loadingText = LOADING_MESSAGES[lang] || LOADING_MESSAGES['en'];
        
        el.innerHTML = '';
        el.textContent = loadingText;
        
        el.classList.remove('ticker-scrolling');
        el.classList.add('ticker-loading');
        
        el.removeAttribute('tabindex');
        el.removeAttribute('role');
        el.removeAttribute('aria-label');
    }

    /* ----------------------------------------------------------
       4. BUILD AND START TICKER
       ---------------------------------------------------------- */
    function buildTicker() {
        var el = document.getElementById('warning_banner');
        if (!el) return;

        var lang = getLang();
        var msgs = MESSAGES[lang] || MESSAGES['en'];

        el.classList.remove('ticker-loading');
        el.classList.add('ticker-scrolling');

        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', 'AI Information Ticker');

        var container1 = document.createElement('div');
        container1.className = 'ticker-items';
        
        var container2 = document.createElement('div');
        container2.className = 'ticker-items';
        container2.setAttribute('aria-hidden', 'true');

        msgs.forEach(function (text) {
            var parts = text.split(' ');
            var icon = parts[0];
            var rest = parts.slice(1).join(' ');

            // Set 1
            var item1 = document.createElement('span');
            item1.className = 'ticker-item';
            
            var iconSpan1 = document.createElement('span');
            iconSpan1.className = 'ticker-icon';
            iconSpan1.textContent = icon;
            
            var textSpan1 = document.createElement('span');
            textSpan1.className = 'ticker-text';
            textSpan1.textContent = rest;

            item1.appendChild(iconSpan1);
            item1.appendChild(textSpan1);
            container1.appendChild(item1);

            // Set 2
            var item2 = document.createElement('span');
            item2.className = 'ticker-item';
            
            var iconSpan2 = document.createElement('span');
            iconSpan2.className = 'ticker-icon';
            iconSpan2.textContent = icon;
            
            var textSpan2 = document.createElement('span');
            textSpan2.className = 'ticker-text';
            textSpan2.textContent = rest;

            item2.appendChild(iconSpan2);
            item2.appendChild(textSpan2);
            container2.appendChild(item2);
        });

        el.innerHTML = '';
        el.appendChild(container1);
        el.appendChild(container2);
    }

    /* ----------------------------------------------------------
       5. EVENT LISTENERS
       ---------------------------------------------------------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoadingState);
    } else {
        initLoadingState();
    }

    // App finished loading all data → start showing scrolling messages
    window.addEventListener('appReady', function () {
        setTimeout(buildTicker, 300);
    });

    // Language switched → rebuild immediately
    window.addEventListener('languageChanged', function () {
        buildTicker();
    });

    // Safety fallback: if appReady never fires (e.g. login page),
    // replace loading state after 2.0 seconds
    setTimeout(function () {
        var el = document.getElementById('warning_banner');
        if (el && el.classList.contains('ticker-scrolling') === false) {
            buildTicker();
        }
    }, 2000);

})();
