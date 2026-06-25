// Krishi-Cure Pro - Advanced Fertilizer Calculator

const fertilizersList = [
    { id: 'urea', name: { en: 'Urea', hi: 'यूरिया', gu: 'યુરિયા' } },
    { id: 'dap', name: { en: 'DAP', hi: 'डीएपी (DAP)', gu: 'ડીએપી (DAP)' } },
    { id: 'npk', name: { en: 'NPK 19:19:19', hi: 'एनपीके (NPK 19:19:19)', gu: 'એનપીકે (NPK 19:19:19)' } },
    { id: 'potash', name: { en: 'Muriate of Potash (MOP)', hi: 'पोटाश (MOP)', gu: 'પોટાશ (MOP)' } },
    { id: 'ssp', name: { en: 'Single Super Phosphate (SSP)', hi: 'सिंगल सुपर फास्फेट (SSP)', gu: 'સિંગલ સુપર ફોસ્ફેટ (SSP)' } },
    { id: 'ammonium_sulphate', name: { en: 'Ammonium Sulphate', hi: 'अमोनियम सल्फेट', gu: 'એમોનિયમ સલ્ફેટ' } },
    { id: 'zinc_sulphate', name: { en: 'Zinc Sulphate', hi: 'जिंक सल्फेट', gu: 'ઝિંક સલ્ફેટ' } },
    { id: 'organic_compost', name: { en: 'Organic Compost', hi: 'जैविक खाद (कम्पोस्ट)', gu: 'દેશી સેન્દ્રિય ખાતર' } },
    { id: 'vermicompost', name: { en: 'Vermicompost', hi: 'वर्मीकंपोस्ट', gu: 'વર્મીકમ્પોસ્ટ' } }
];

window.selectedCropId = null;
window.selectedCropName = '';
window.selectedFertilizerId = null;
window.selectedFertilizerName = '';
window.latestFertilizerResult = null;

async function initAppAndCalculator() {
    if (window.initApp) {
        await window.initApp();
    }
    initFertilizerCalculator();
}

if (document.readyState === 'loading') {
    window.addEventListener('load', initAppAndCalculator);
} else {
    initAppAndCalculator();
}

function initFertilizerCalculator() {
    applyFertilizerTranslations();
    setupSearchableDropdowns();
    setupEventListeners();
    restoreInputsFromLocalStorage();
    setupAccordions();

    window.addEventListener('languageChanged', () => {
        applyFertilizerTranslations();
        refreshSelectedDisplay();
        setupSearchableDropdowns();
        if (window.latestFertilizerResult) {
            // Re-calculate to localize output result
            calculateFertilizer();
        }
    });
}

function applyFertilizerTranslations() {
    const lang = window.currentLang || 'en';
    
    // Placeholders and localized inputs
    const cropSearch = document.getElementById('crop_search');
    if (cropSearch) {
        cropSearch.placeholder = window.t('search_crop') || 'Search crop...';
    }
    const fertSearch = document.getElementById('fertilizer_search');
    if (fertSearch) {
        fertSearch.placeholder = window.t('search_fert_placeholder') || 'Search fertilizer...';
    }
}

function getCropsList() {
    const crops = [];
    if (window.appData && window.appData.cropsList) {
        const lang = window.currentLang || 'en';
        for (const cat in window.appData.cropsList) {
            window.appData.cropsList[cat].forEach(c => {
                crops.push({
                    id: c.id,
                    name: {
                        en: c.en,
                        hi: c.hi,
                        gu: c.gu
                    }
                });
            });
        }
    }
    return crops;
}

function setupSearchableDropdowns() {
    const crops = getCropsList();
    setupSearchableDropdown('crop_search', 'crop_dropdown', crops, (id, name) => {
        window.selectedCropId = id;
        window.selectedCropName = name;
        updateCropSelectedDisplay();
        saveInputsToLocalStorage();
    });

    setupSearchableDropdown('fertilizer_search', 'fertilizer_dropdown', fertilizersList, (id, name) => {
        window.selectedFertilizerId = id;
        window.selectedFertilizerName = name;
        updateFertSelectedDisplay();
        saveInputsToLocalStorage();
    });
}

function setupSearchableDropdown(inputId, listId, dataList, onSelect) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    
    if (!input || !list) return;
    
    const renderList = (searchTerm = '') => {
        list.innerHTML = '';
        const lang = window.currentLang || 'en';
        
        const filtered = dataList.filter(item => {
            const name = (item.name[lang] || item.name.en).toLowerCase();
            return name.includes(searchTerm.toLowerCase());
        });
        
        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'dropdown-item';
            div.textContent = item.name[lang] || item.name.en;
            div.dataset.id = item.id;
            
            div.addEventListener('mousedown', (e) => {
                e.preventDefault();
                input.value = item.name[lang] || item.name.en;
                onSelect(item.id, item.name[lang] || item.name.en);
                list.classList.remove('active');
            });
            list.appendChild(div);
        });
        
        if (filtered.length > 0) {
            list.classList.add('active');
        } else {
            list.classList.remove('active');
        }
    };
    
    input.addEventListener('focus', () => renderList(input.value));
    input.addEventListener('input', (e) => renderList(e.target.value));
    input.addEventListener('blur', () => {
        setTimeout(() => list.classList.remove('active'), 200);
    });
}

function updateCropSelectedDisplay() {
    const display = document.getElementById('selected_crop_display');
    if (display) {
        display.textContent = window.selectedCropName ? `✓ Selected: ${window.selectedCropName}` : '';
        display.style.color = 'var(--leaf-green)';
        display.style.fontWeight = '700';
    }
}

function updateFertSelectedDisplay() {
    const display = document.getElementById('selected_fert_display');
    if (display) {
        display.textContent = window.selectedFertilizerName ? `✓ Selected: ${window.selectedFertilizerName}` : '';
        display.style.color = 'var(--leaf-green)';
        display.style.fontWeight = '700';
    }
}

function refreshSelectedDisplay() {
    const lang = window.currentLang || 'en';
    if (window.selectedCropId) {
        const crops = getCropsList();
        const crop = crops.find(c => c.id === window.selectedCropId);
        if (crop) {
            window.selectedCropName = crop.name[lang] || crop.name.en;
            const input = document.getElementById('crop_search');
            if (input) input.value = window.selectedCropName;
            updateCropSelectedDisplay();
        }
    }
    if (window.selectedFertilizerId) {
        const fert = fertilizersList.find(f => f.id === window.selectedFertilizerId);
        if (fert) {
            window.selectedFertilizerName = fert.name[lang] || fert.name.en;
            const input = document.getElementById('fertilizer_search');
            if (input) input.value = window.selectedFertilizerName;
            updateFertSelectedDisplay();
        }
    }
}

function setupEventListeners() {
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateFertilizer);
    }

    const unitSelect = document.getElementById('unit_select');
    if (unitSelect) {
        unitSelect.addEventListener('change', saveInputsToLocalStorage);
    }

    const areaInput = document.getElementById('area_input');
    if (areaInput) {
        areaInput.addEventListener('input', saveInputsToLocalStorage);
    }

}

function setupAccordions() {
    const headers = ['schedule', 'method', 'precautions', 'tips'];
    headers.forEach(header => {
        const btn = document.getElementById(`btn-accordion-${header}`);
        const content = document.getElementById(`content-${header}`);
        
        if (btn && content) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
                const isOpen = content.style.display === 'block';
                content.style.display = isOpen ? 'none' : 'block';
                const arrowEl = document.getElementById(`arrow-${header}`);
                if (arrowEl) {
                    arrowEl.textContent = isOpen ? '➕' : '➖';
                }
            });
        }
    });
}

async function calculateFertilizer() {
    const areaValue = parseFloat(document.getElementById('area_input').value);
    const unit = document.getElementById('unit_select').value;

    if (!window.selectedCropId) {
        window.showToast(window.t('fert_err_select_crop') || "Please select a crop", 'error');
        return;
    }
    if (!window.selectedFertilizerId) {
        window.showToast("Please select a fertilizer", 'error');
        return;
    }
    if (isNaN(areaValue) || areaValue <= 0) {
        window.showToast(window.t('fert_err_invalid_area') || "Please enter a valid area", 'error');
        return;
    }

    window.showLoader("Calculating Requirements...");

    try {
        const lang = window.currentLang || 'en';
        const response = await fetch('/api/fertilizer/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cropId: window.selectedCropId,
                fertilizerId: window.selectedFertilizerId,
                areaUnit: unit,
                areaValue: areaValue,
                lang: lang
            })
        });

        if (!response.ok) throw new Error("Calculation API failed");
        const json = await response.json();
        // API wraps all responses: { success: true, data: {...} }
        const data = json.data || json;
        
        // Normalize field names from API response
        const normalized = {
            ...data,
            quantity: data.quantity?.total ?? data.quantity,
            quantity_per_unit: data.quantity?.per_unit_area ?? data.quantity_per_unit,
            method: data.application?.details ?? data.method,
            fertilizer_name: data.fertilizer_name
        };
        
        window.latestFertilizerResult = normalized;
        displayResults(normalized);
    } catch (e) {
        console.error(e);
        window.showToast("Calculation failed. Please verify fields.", 'error');
    } finally {
        window.hideLoader();
    }
}

function displayResults(data) {
    const resultsEmpty = document.getElementById('results-empty');
    const resultsContent = document.getElementById('results-content');
    
    if (resultsEmpty) resultsEmpty.style.display = 'none';
    if (resultsContent) resultsContent.style.display = 'block';

    const formattedCrop = window.selectedCropName.toUpperCase();
    const formattedFert = data.fertilizer_name.toUpperCase();
    
    const resTitle = document.getElementById('res_title');
    if (resTitle) resTitle.textContent = `${formattedCrop} + ${formattedFert}`;
    
    const resAreaDesc = document.getElementById('res_area_desc');
    if (resAreaDesc) {
        const unitKey = 'opt_' + data.area.unit.toLowerCase();
        const translatedUnit = window.t(unitKey) || data.area.unit;
        const translatedHectares = window.t('opt_hectare') || 'Hectares';
        resAreaDesc.textContent = `${window.t('fert_res_area_desc') || 'For total area of'} ${data.area.value} ${translatedUnit} (${data.area.hectares} ${translatedHectares})`;
    }

    const container = document.getElementById('quantity-cards-container');
    if (container) {
        const unitKey = 'opt_' + data.area.unit.toLowerCase();
        const translatedUnit = window.t(unitKey) || data.area.unit;
        container.innerHTML = `
            <div class="result-card" style="grid-column: 1 / -1;">
                <div class="fert-name" style="font-size: 1.2rem; color: var(--forest-green); font-weight: 800;">${data.fertilizer_name}</div>
                <div class="fert-val" style="font-size: 3rem; margin: 0.5rem 0; color: var(--forest-green); font-weight: 800;">
                    ${data.quantity} <span style="font-size: 1.5rem; font-weight: 700;">kg</span>
                </div>
                <div style="font-size: 0.95rem; color: var(--text-light); margin-top: 0.8rem; border-top: 1px solid var(--glass-border); padding-top: 0.6rem; font-weight: 600;">
                    ${window.t('lbl_qty_per_unit') || 'Per Unit Area'}: ${data.quantity_per_unit} kg (${window.t('lbl_per') || 'per'} ${translatedUnit})
                </div>
            </div>
        `;
    }

    const contentSchedule = document.getElementById('content-schedule');
    if (contentSchedule) contentSchedule.innerHTML = `<p style="margin: 0; font-weight: 600;">${data.schedule}</p>`;

    const contentMethod = document.getElementById('content-method');
    if (contentMethod) contentMethod.innerHTML = `<p style="margin: 0;">${data.method}</p>`;

    const contentPrecautions = document.getElementById('content-precautions');
    if (contentPrecautions) contentPrecautions.innerHTML = `<p style="margin: 0; color: #b91c1c; font-weight: 600;">${data.precautions}</p>`;

    const contentTips = document.getElementById('content-tips');
    if (contentTips) contentTips.innerHTML = `<p style="margin: 0;">${data.recommendations}</p>`;
}

function saveInputsToLocalStorage() {
    localStorage.setItem('krishiFertLastInputs', JSON.stringify({
        cropId: window.selectedCropId,
        cropName: window.selectedCropName,
        fertilizerId: window.selectedFertilizerId,
        fertilizerName: window.selectedFertilizerName,
        areaUnit: document.getElementById('unit_select')?.value,
        areaValue: document.getElementById('area_input')?.value
    }));
}

function restoreInputsFromLocalStorage() {
    try {
        const saved = localStorage.getItem('krishiFertLastInputs');
        if (saved) {
            const data = JSON.parse(saved);
            if (data) {
                if (data.cropId) {
                    window.selectedCropId = data.cropId;
                    window.selectedCropName = data.cropName;
                    const cropInput = document.getElementById('crop_search');
                    if (cropInput) cropInput.value = data.cropName;
                    updateCropSelectedDisplay();
                }
                if (data.fertilizerId) {
                    window.selectedFertilizerId = data.fertilizerId;
                    window.selectedFertilizerName = data.fertilizerName;
                    const fertInput = document.getElementById('fertilizer_search');
                    if (fertInput) fertInput.value = data.fertilizerName;
                    updateFertSelectedDisplay();
                }
                if (data.areaUnit) {
                    const unitSelect = document.getElementById('unit_select');
                    if (unitSelect) unitSelect.value = data.areaUnit;
                }
                if (data.areaValue) {
                    const areaInput = document.getElementById('area_input');
                    if (areaInput) areaInput.value = data.areaValue;
                }
            }
        }
    } catch (e) {
        console.error("Failed to restore fertilizer inputs:", e);
    }
}
