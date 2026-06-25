window.submitDiagnosis = async (cropId, symptoms, lang) => {
    const diagnoseBtn = document.getElementById('diagnose_btn');
    const originalText = diagnoseBtn ? diagnoseBtn.textContent : "";
    
    // Set loading state
    if (diagnoseBtn) {
        diagnoseBtn.disabled = true;
        const analyzingText = lang === 'gu' ? "વિશ્લેષણ થઈ રહ્યું છે..." : lang === 'hi' ? "विश्लेषण हो रहा है..." : "Analyzing with AI...";
        diagnoseBtn.textContent = analyzingText;
        diagnoseBtn.style.opacity = '0.7';
    }

    try {
        const response = await fetch('/api/diagnose', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cropId, symptoms, lang })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const json = await response.json();
        // API wraps all responses: { success: true, data: {...} }
        const data = json.data || json;
        
        // Save to session storage and redirect
        sessionStorage.setItem('diagnosisResult', JSON.stringify(data));
        window.location.href = '/result.html';

    } catch (error) {
        console.error("Diagnosis error:", error);
        alert(lang === 'gu' ? "નિદાનમાં ભૂલ. કૃપા કરીને ફરી પ્રયાસ કરો." : lang === 'hi' ? "निदान में त्रुटि। कृपया पुनः प्रयास करें।" : "Error generating diagnosis. Please try again.");
        
        if (diagnoseBtn) {
            diagnoseBtn.disabled = false;
            diagnoseBtn.textContent = originalText;
            diagnoseBtn.style.opacity = '1';
        }
    }
};
