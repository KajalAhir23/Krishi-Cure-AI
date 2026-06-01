// Frontend App State and Language Management
window.appData = null;
window.currentLang = localStorage.getItem('krishiLang') || 'en';

window.initApp = async () => {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to load data');
        window.appData = await response.json();
        
        setupLanguageToggles();
        applyTranslations();
        setupMobileNavbar();
    } catch (err) {
        console.error("Error initializing app:", err);
        document.getElementById('warning_banner').textContent = "Error loading application data. Please refresh.";
    }
};

function setupLanguageToggles() {
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        // Set active state based on currentLang
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
            
            // Update active class
            langBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            applyTranslations();
            
            // Dispatch event for other scripts to re-render
            window.dispatchEvent(new Event('languageChanged'));
        });
    });
}

function applyTranslations() {
    if (!window.appData) return;
    const langStore = window.appData.langStore[window.currentLang];
    if (!langStore) return;

    // Apply translations to standard elements using IDs
    const elementsToTranslate = {
        'warning_banner': 'warning_banner',
        'app_name': 'app_name',
        'select_crop_title': 'select_crop',
        'search_crop_input': 'search_crop',
        'back_btn': 'back',
        'back-to-cat': 'back',
        'symptoms_for_title': 'symptoms_for',
        'select_symptoms_text': 'select_symptoms',
        'diagnose_btn': 'diagnose',
        'diagnosis_result_title': 'diagnosis_result',
        'disease_prefix_text': 'disease_prefix',
        'match_text': 'match',
        'action_plan_title': 'action_plan_title',
        'speak_btn_text': 'speak_btn',
        'restart_btn': 'restart',
        'logout_btn': 'logout',
        'welcome_greeting': 'welcome_back'
    };

    for (const [id, key] of Object.entries(elementsToTranslate)) {
        const el = document.getElementById(id);
        if (el && langStore[key]) {
            // Check if it's an input/select element placeholder
            if (el.tagName === 'INPUT') {
                el.placeholder = langStore[key];
            } else if (el.tagName === 'OPTION') {
                el.textContent = langStore[key];
            } else {
                // If it's a specific span next to icons, preserve structure
                if (id === 'app_name' && el.parentElement.classList.contains('logo')) {
                    el.textContent = langStore[key];
                } else if (id === 'symptoms_for_title') {
                    el.textContent = langStore[key].replace(':', '');
                } else if (id === 'back_btn' || id === 'back-to-cat') {
                    el.textContent = langStore[key];
                } else {
                    el.textContent = langStore[key];
                }
            }
        }
    }

    // Dynamic document title
    document.title = langStore.app_name || 'Krishi-Cure Pro';
}

function setupMobileNavbar() {
    const header = document.querySelector('.app-header');
    if (!header) return;

    // Create hamburger button if it doesn't exist
    let toggle = document.getElementById('nav-toggle');
    if (!toggle) {
        toggle = document.createElement('button');
        toggle.id = 'nav-toggle';
        toggle.className = 'nav-toggle';
        toggle.setAttribute('aria-label', 'Toggle Navigation');
        toggle.innerHTML = '<span class="hamburger"></span>';
        header.appendChild(toggle);
    }

    const langSelector = document.querySelector('.lang-selector');
    if (langSelector) {
        // Remove any existing listeners by cloning
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        toggle = newToggle;

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle.classList.toggle('active');
            langSelector.classList.toggle('open');
        });

        // Close menu when clicking outside or selecting a language
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !langSelector.contains(e.target)) {
                toggle.classList.remove('active');
                langSelector.classList.remove('open');
            }
        });

        langSelector.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toggle.classList.remove('active');
                langSelector.classList.remove('open');
            });
        });
    }
}

