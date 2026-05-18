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
        'restart_btn': 'restart'
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
