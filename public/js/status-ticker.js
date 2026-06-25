/* ================================================================
   KRISHI-CURE PRO — Status Ticker System v1.0
   ----------------------------------------------------------------
   Replaces "Loading..." with rotating, multilingual status messages
   after app initialization. Responds to language changes in real time.

   Rules:
   - Zero changes to business logic, colors, navbar, or auth
   - Works on all pages (index, symptoms, result, upload, etc.)
   - Gracefully degrades if appReady never fires (login page)
   ================================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. MESSAGE BANK — All languages
       ---------------------------------------------------------- */
    const MESSAGES = {
        en: [
            '\u2705 AI-powered crop disease detection and farming assistance platform.',
            '\u2705 Select crop symptoms or upload images for instant AI diagnosis.',
            '\u2705 Weather insights and smart farming recommendations available.',
            '\u2705 Fertilizer calculator available for precise nutrient management.',
            '\u2705 Multi-language support: English, Hindi and Gujarati.',
            '\u2705 Disease predictions are AI-generated \u2014 verify when confidence is low.',
            '\u2705 Upload up to 4 crop images for accurate multi-angle diagnosis.',
            '\u2705 ICAR-aligned crop disease database with organic & chemical treatments.',
        ],
        hi: [
            '\u2705 \u090f\u0906\u0908 \u0906\u0927\u093e\u0930\u093f\u0924 \u092b\u0938\u0932 \u0930\u094b\u0917 \u092a\u0939\u091a\u093e\u0928 \u0914\u0930 \u0915\u0943\u0937\u093f \u0938\u0939\u093e\u092f\u0924\u093e \u092e\u0902\u091a\u0964',
            '\u2705 \u0930\u094b\u0917 \u092a\u0939\u091a\u093e\u0928 \u0915\u0947 \u0932\u093f\u090f \u0932\u0915\u094d\u0937\u0923 \u091a\u0941\u0928\u0947\u0902 \u092f\u093e \u0924\u0938\u094d\u0935\u0940\u0930 \u0905\u092a\u0932\u094b\u0921 \u0915\u0930\u0947\u0902\u0964',
            '\u2705 \u092e\u094c\u0938\u092e \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0914\u0930 \u0938\u094d\u092e\u093e\u0930\u094d\u091f \u0916\u0947\u0924\u0940 \u0938\u0941\u091d\u093e\u0935 \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0902\u0964',
            '\u2705 \u0938\u091f\u0940\u0915 \u092a\u094b\u0937\u0923 \u092a\u094d\u0930\u092c\u0902\u0927\u0928 \u0915\u0947 \u0932\u093f\u090f \u0909\u0930\u094d\u0935\u0930\u0915 \u0915\u0948\u0932\u0915\u0941\u0932\u0947\u091f\u0930 \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0964',
            '\u2705 \u092c\u0939\u0941\u092d\u093e\u0937\u093e \u0938\u092e\u0930\u094d\u0925\u0928: \u0905\u0902\u0917\u094d\u0930\u0947\u091c\u093c\u0940, \u0939\u093f\u0928\u094d\u0926\u0940 \u0914\u0930 \u0917\u0941\u091c\u0930\u093e\u0924\u0940\u0964',
            '\u2705 \u0915\u092e \u0935\u093f\u0936\u094d\u0935\u093e\u0938 \u0938\u094d\u0924\u0930 \u0939\u094b\u0928\u0947 \u092a\u0930 \u0935\u093f\u0936\u0947\u0937\u091c\u094d\u091e \u0938\u0947 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0930\u0947\u0902\u0964',
            '\u2705 \u0938\u091f\u0940\u0915 \u0928\u093f\u0926\u093e\u0928 \u0915\u0947 \u0932\u093f\u090f 4 \u0924\u0915 \u092b\u0938\u0932 \u091a\u093f\u0924\u094d\u0930 \u0905\u092a\u0932\u094b\u0921 \u0915\u0930\u0947\u0902\u0964',
            '\u2705 \u0906\u0908\u0938\u0940\u090f\u0906\u0930 \u0906\u0927\u093e\u0930\u093f\u0924 \u0930\u094b\u0917 \u0921\u0947\u091f\u093e\u092c\u0947\u0938 \u0914\u0930 \u091c\u0948\u0935\u093f\u0915 \u0935 \u0930\u093e\u0938\u093e\u092f\u0928\u093f\u0915 \u0909\u092a\u091a\u093e\u0930 \u092f\u094b\u091c\u0928\u093e\u090f\u0902\u0964',
        ],
        gu: [
            '\u2705 \u0a8f\u0a86\u0a88 \u0a86\u0aa7\u0abe\u0ab0\u0abf\u0aa4 \u0aaa\u0abe\u0a95 \u0ab0\u0acb\u0a97 \u0aa8\u0abf\u0aa6\u0abe\u0aa8 \u0a85\u0aa8\u0ac7 \u0a95\u0ac3\u0ab7\u0abf \u0ab8\u0ab9\u0abe\u0aaf \u0aaa\u0acd\u0ab2\u0ac7\u0a9f\u0aab\u0acb\u0ab0\u0acd\u0aae.',
            '\u2705 \u0ab0\u0acb\u0a97 \u0aa8\u0abf\u0aa6\u0abe\u0aa8 \u0aae\u0abe\u0a9f\u0ac7 \u0ab2\u0a95\u0acd\u0ab7\u0aa3\u0acb \u0aaa\u0ab8\u0a82\u0aa6 \u0a95\u0ab0\u0acb \u0a85\u0aa5\u0ab5\u0abe \u0aab\u0acb\u0a9f\u0abe \u0a85\u0aaa\u0ab2\u0acb\u0aa1 \u0a95\u0ab0\u0acb.',
            '\u2705 \u0ab9\u0ab5\u0abe\u0aae\u0abe\u0aa8 \u0aae\u0abe\u0ab9\u0abf\u0aa4\u0ac0 \u0a85\u0aa8\u0ac7 \u0ab8\u0acd\u0aae\u0abe\u0ab0\u0acd\u0a9f \u0a96\u0ac7\u0aa4\u0ac0 \u0aae\u0abe\u0ab0\u0a97\u0aa6\u0ab0\u0acd\u0ab6\u0aa8 \u0abf\u0aaa\u0ab2\u0acd\u0aa7.',
            '\u2705 \u0a9a\u0acb\u0a95\u0acd\u0a95\u0ab8 \u0aaa\u0acb\u0ab7\u0aa3 \u0ab5\u0acd\u0aaf\u0ab5\u0ab8\u0acd\u0aa5\u0abe\u0aaa\u0aa8 \u0aae\u0abe\u0a9f\u0ac7 \u0a96\u0abe\u0aa4\u0ab0 \u0a95\u0ac7\u0ab2\u0acd\u0a95\u0acd\u0aaf\u0ac1\u0ab2\u0ac7\u0a9f\u0ab0 \u0abf\u0aaa\u0ab2\u0acd\u0aa7.',
            '\u2705 \u0aac\u0ab9\u0ac1\u0aad\u0abe\u0ab7\u0abe \u0ab8\u0aae\u0ab0\u0acd\u0aa5\u0aa8: \u0a85\u0a82\u0a97\u0acd\u0ab0\u0ac7\u0a9c\u0ac0, \u0ab9\u0abf\u0aa8\u0acd\u0aa6\u0ac0 \u0a85\u0aa8\u0ac7 \u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0.',
            '\u2705 \u0a93\u0a9b\u0abe \u0ab5\u0abf\u0ab6\u0acd\u0ab5\u0abe\u0ab8 \u0ab8\u0acd\u0aa4\u0ab0\u0ac7 \u0a95\u0ac3\u0ab7\u0abf \u0aa8\u0abf\u0ab7\u0acd\u0aa3\u0abe\u0aa4\u0aa8\u0ac0 \u0ab8\u0ab2\u0abe\u0ab9 \u0ab2\u0acb.',
            '\u2705 \u0ab8\u0a9a\u0acb\u0a9f \u0aa8\u0abf\u0aa6\u0abe\u0aa8 \u0aae\u0abe\u0a9f\u0ac7 4 \u0ab8\u0ac1\u0aa7\u0ac0 \u0aaa\u0abe\u0a95 \u0aab\u0acb\u0a9f\u0abe \u0a85\u0aaa\u0ab2\u0acb\u0aa1 \u0a95\u0ab0\u0acb.',
            '\u2705 \u0a86\u0a88\u0ab8\u0ac0\u0a8f\u0a86\u0ab0 \u0a86\u0aa7\u0abe\u0ab0\u0abf\u0aa4 \u0ab0\u0acb\u0a97 \u0aa1\u0ac7\u0a9f\u0abe\u0aac\u0ac7\u0a9d \u0a85\u0aa8\u0ac7 \u0ab8\u0abe\u0ab0\u0ab5\u0abe\u0ab0 \u0aaf\u0acb\u0a9c\u0aa8\u0abe\u0a93.',
        ],
    };

    /* ----------------------------------------------------------
       2. STATE
       ---------------------------------------------------------- */
    var rotateTimer = null;
    var msgIndex = 0;
    var INTERVAL = 5000; // ms between message rotations

    /* ----------------------------------------------------------
       3. HELPERS
       ---------------------------------------------------------- */
    function getLang() {
        return window.currentLang || localStorage.getItem('krishiLang') || 'en';
    }

    function getMessages() {
        var lang = getLang();
        return MESSAGES[lang] || MESSAGES['en'];
    }

    function getBannerEl() {
        return document.getElementById('warning_banner');
    }

    /* ----------------------------------------------------------
       4. TRANSITION: crossfade text change
       ---------------------------------------------------------- */
    function setMessage(text) {
        var el = getBannerEl();
        if (!el) return;

        // Add fade-out class
        el.classList.add('fade-out');

        setTimeout(function () {
            el.textContent = text;
            el.classList.remove('fade-out');
        }, 350); // matches CSS transition duration
    }

    /* ----------------------------------------------------------
       5. START ROTATION
       ---------------------------------------------------------- */
    function startRotation() {
        var el = getBannerEl();
        if (!el) return;

        // Switch to ready (centered, no scroll) mode
        el.classList.add('ready');

        // Stop any existing timer
        clearInterval(rotateTimer);

        // Reset to first message of current language
        var messages = getMessages();
        msgIndex = 0;
        setMessage(messages[msgIndex]);

        // Rotate every INTERVAL ms
        rotateTimer = setInterval(function () {
            var msgs = getMessages();
            msgIndex = (msgIndex + 1) % msgs.length;
            setMessage(msgs[msgIndex]);
        }, INTERVAL);
    }

    /* ----------------------------------------------------------
       6. EVENT LISTENERS
       ---------------------------------------------------------- */

    // App finished loading all data → start showing messages
    window.addEventListener('appReady', function () {
        // Small delay so any synchronous translation runs first
        setTimeout(startRotation, 400);
    });

    // Language switched → reset rotation in new language immediately
    window.addEventListener('languageChanged', function () {
        clearInterval(rotateTimer);
        msgIndex = 0;
        startRotation();
    });

    // Safety fallback: if appReady never fires (e.g. login page without
    // full app.js init), replace "Loading..." after 2.5 seconds
    setTimeout(function () {
        var el = getBannerEl();
        if (el && el.classList.contains('ready') === false) {
            startRotation();
        }
    }, 2500);

})();
