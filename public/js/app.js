// Frontend App State and Language Management
window.appData = null;
window.currentLang = localStorage.getItem('krishiLang') || 'en';

// Auth Guard Check
window.checkAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPath = window.location.pathname;
    
    // Allow public pages
    if (!isLoggedIn && !currentPath.includes('login.html')) {
        window.location.href = '/login.html';
    }
    // Redirect logged in users away from login page
    if (isLoggedIn && currentPath.includes('login.html')) {
        window.location.href = '/index.html';
    }
};

// Instantly check auth
window.checkAuth();

window.initApp = async () => {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to load data');
        const json = await response.json();
        // API wraps all responses: { success: true, data: {...} }
        window.appData = json.data || json;
        
        setupLanguageToggles();
        applyTranslations();
        setupMobileNavbar();
        window.handleUrlRouting();
        
        // Dispatch global appReady event for other scripts to safely run
        window.dispatchEvent(new Event('appReady'));
    } catch (err) {
        console.error("Error initializing app:", err);
        const warningBanner = document.getElementById('warning_banner');
        if (warningBanner) {
            warningBanner.textContent = "Error loading application data. Please refresh.";
        }
    }
};

// Shorthand Translation Helper
window.t = (key) => {
    if (!window.appData || !window.appData.langStore) return key;
    const store = window.appData.langStore[window.currentLang];
    return (store && store[key]) ? store[key] : key;
};

// Toast Notification System
window.showToast = (message, type = 'info') => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';
    
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
            container.remove();
        }
    }, 4000);
};

// Loader Overlay Systems
window.showLoader = (text = 'Loading...') => {
    let overlay = document.getElementById('app-loader-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'app-loader-overlay';
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(255,255,255,0.8)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '99999';
        overlay.style.backdropFilter = 'blur(4px)';
        
        overlay.innerHTML = `
            <div class="spinner"></div>
            <div id="app-loader-text" style="color: var(--forest-green); font-weight:700; margin-top:1rem; font-family:'Outfit',sans-serif;">${text}</div>
        `;
        document.body.appendChild(overlay);
    } else {
        const textEl = document.getElementById('app-loader-text');
        if (textEl) textEl.textContent = text;
    }
};

window.hideLoader = () => {
    const overlay = document.getElementById('app-loader-overlay');
    if (overlay) overlay.remove();
};

function setupLanguageToggles() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        if (btn.dataset.lang === window.currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.addEventListener('click', (e) => {
            if (btn.disabled) return;
            const newLang = e.target.dataset.lang;
            window.currentLang = newLang;
            localStorage.setItem('krishiLang', newLang);
            
            langBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            applyTranslations();
            window.dispatchEvent(new Event('languageChanged'));
        });
    });
}

function applyTranslations() {
    if (!window.appData || !window.appData.langStore) return;
    const langStore = window.appData.langStore[window.currentLang] || {};

    const elementsToTranslate = {
        'select_symptoms_text': 'select_symptoms',
        'diagnose_btn': 'diagnose',
        'diagnosis_result_title': 'diagnosis_result',
        'disease_prefix_text': 'disease_prefix',
        'match_text': 'match',
        'action_plan_title': 'action_plan_title',
        'restart_btn': 'restart',
        'logout_btn': 'logout',
        'welcome_greeting': 'welcome_back',
        
        // Navigation links
        'nav_home': 'nav_home',
        'nav_disease': 'nav_disease',
        'nav_fertilizer': 'nav_fertilizer',
        'nav_weather': 'nav_weather',
        'nav_chatbot': 'nav_chatbot',
        'nav_logout': 'logout',
        'nav_login': 'login_title',

        // Footer links
        'footer_about_title': 'footer_about_title',
        'footer_about_desc': 'footer_about_desc',
        'footer_quick_links': 'footer_quick_links',
        'footer_resources': 'footer_resources',
        'footer_contact': 'footer_contact',
        'footer_rights': 'footer_rights',
        'lbl-weather': 'lbl_weather',
        'footer_dev_by': 'developer_credit',

        // Fertilizer page
        'fert_title': 'fert_title',
        'fert_subtitle': 'fert_subtitle',
        'fert_lbl_crop': 'fert_lbl_crop',
        'fert_lbl_state': 'fert_lbl_state',
        'fert_lbl_unit': 'fert_lbl_unit',
        'fert_lbl_value': 'fert_lbl_value',
        'fert_btn_calc': 'fert_btn_calc',
        'fert_res_title': 'fert_res_title',
        'fert_res_area_desc': 'fert_res_area_desc',
        'fert_lbl_urea': 'fert_lbl_urea',
        'fert_lbl_dap': 'fert_lbl_dap',
        'upload_limit_info': 'upload_limit_info',
        'recommended_images_title': 'recommended_images_title',
        'rec_img_1': 'rec_img_1',
        'rec_img_2': 'rec_img_2',
        'rec_img_3': 'rec_img_3',
        'rec_img_4': 'rec_img_4',
        'optional_symptoms_title': 'optional_symptoms_title',
        'optional_symptoms_desc': 'optional_symptoms_desc',
        'btn_analyze': 'btn_analyze',
        'analyzing_images_text': 'analyzing_images_text'
    };

    for (const [id, key] of Object.entries(elementsToTranslate)) {
        const el = document.getElementById(id);
        if (el && langStore[key]) {
            if (el.tagName === 'INPUT') {
                el.placeholder = langStore[key];
            } else if (el.tagName === 'OPTION') {
                el.textContent = langStore[key];
            } else {
                if (id === 'symptoms_for_title') {
                    el.textContent = langStore[key].replace(':', '');
                } else {
                    el.textContent = langStore[key];
                }
            }
        }
    }

    // Auto translate via data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langStore[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = langStore[key];
            } else {
                el.textContent = langStore[key];
            }
        }
    });

    document.title = langStore.app_name || 'Krishi-Cure Pro';
}

function setupMobileNavbar() {
    const header = document.querySelector('.app-header');
    if (!header) return;

    let toggle = document.getElementById('nav-toggle');
    if (!toggle) {
        toggle = document.createElement('button');
        toggle.id = 'nav-toggle';
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-label', 'Toggle Navigation');
        toggle.innerHTML = '<span class="hamburger"></span>';
        header.appendChild(toggle);
    }

    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        toggle = newToggle;

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navMenu.contains(e.target)) {
                toggle.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    }
}

window.syncNavbarActiveState = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length === 0) return;

    // Clear active classes from all links
    navLinks.forEach(link => link.classList.remove('active'));

    const currentPath = window.location.pathname;

    if (currentPath.includes('chatbot.html')) {
        const chatbotLink = document.getElementById('nav_chatbot');
        if (chatbotLink) chatbotLink.classList.add('active');
    } else if (currentPath.includes('weather.html')) {
        const weatherLink = document.getElementById('nav_weather');
        if (weatherLink) weatherLink.classList.add('active');
    } else if (currentPath.includes('fertilizer-calculator.html')) {
        const fertLink = document.getElementById('nav_fertilizer');
        if (fertLink) fertLink.classList.add('active');
    } else {
        // Any other page defaults to Home
        const homeLink = document.getElementById('nav_home');
        if (homeLink) homeLink.classList.add('active');
    }
};

window.handleUrlRouting = () => {
    const currentPath = window.location.pathname;

    // 1. Weather section visibility
    const weatherSection = document.getElementById('weather-section');
    if (weatherSection) {
        if (currentPath.includes('weather.html')) {
            weatherSection.style.display = 'block';
            weatherSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Trigger weather init if first load
            if (!window.weatherInitialized && typeof window.__initWeather === 'function') {
                window.__initWeather();
                window.weatherInitialized = true;
            }
        } else {
            weatherSection.style.display = 'none';
        }
    }

    // 2. Chatbot modal visibility
    const chatbotModal = document.getElementById('krishi-chatbot-ui');
    if (chatbotModal) {
        if (currentPath.includes('chatbot.html')) {
            chatbotModal.classList.add('active');
            const input = document.getElementById('chatbot-ui-input');
            if (input) input.focus();
            if (window.renderMessages) window.renderMessages();
            
            if (typeof window.setChatbotModalOpen === 'function') {
                window.setChatbotModalOpen(true);
            }
        } else {
            chatbotModal.classList.remove('active');
            
            if (typeof window.setChatbotModalOpen === 'function') {
                window.setChatbotModalOpen(false);
            }
        }
    }

    // 3. Sync active navbar highlights
    window.syncNavbarActiveState();
};

function setupNavbarClickInterceptors() {
    const homeLink = document.getElementById('nav_home');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            const path = window.location.pathname;
            // Prevent reload if already on home pages
            if (path === '/' || path.includes('index.html') || path.includes('weather.html') || path.includes('chatbot.html') || path.includes('symptoms.html') || path.includes('upload.html') || path.includes('result.html') || path.includes('diagnosis-choice.html')) {
                if (path.includes('symptoms.html') || path.includes('upload.html') || path.includes('result.html') || path.includes('diagnosis-choice.html')) {
                    // Let navigation back to home page happen normally
                    return;
                }
                e.preventDefault();
                history.pushState(null, '', '/index.html');
                window.handleUrlRouting();
            }
        });
    }

    const weatherLink = document.getElementById('nav_weather');
    if (weatherLink) {
        weatherLink.addEventListener('click', (e) => {
            const path = window.location.pathname;
            const weatherSection = document.getElementById('weather-section');
            if (weatherSection) {
                // If on index.html, intercept and toggle
                e.preventDefault();
                if (path.includes('weather.html')) {
                    history.pushState(null, '', '/index.html');
                } else {
                    history.pushState(null, '', '/weather.html');
                }
                window.handleUrlRouting();
            }
        });
    }

    const chatbotLink = document.getElementById('nav_chatbot');
    if (chatbotLink) {
        chatbotLink.addEventListener('click', (e) => {
            e.preventDefault();
            const path = window.location.pathname;
            if (path.includes('chatbot.html')) {
                // Close chatbot, restoring previous base page URL
                const restorePath = window.lastActivePath || '/index.html';
                const finalPath = restorePath.includes('chatbot.html') ? '/index.html' : restorePath;
                history.pushState(null, '', finalPath);
            } else {
                // Open chatbot, saving current path
                window.lastActivePath = path;
                history.pushState(null, '', '/chatbot.html');
            }
            window.handleUrlRouting();
        });
    }
}

window.applyGlobalTranslations = applyTranslations;

// Event listeners for synchronization on load, popstate, pageshow, and languageChanged
window.addEventListener('languageChanged', () => window.handleUrlRouting());
window.addEventListener('pageshow', () => {
    window.handleUrlRouting();
    setupNavbarClickInterceptors();
});
window.addEventListener('popstate', () => window.handleUrlRouting());

// Also initialize click interceptors immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNavbarClickInterceptors);
} else {
    setupNavbarClickInterceptors();
}
