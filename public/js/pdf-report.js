// Krishi Cure AI - Professional PDF Report Generator
// Requires html2pdf.js CDN on the page

window.downloadDiseaseReportPDF = function(diagnosisData, cropName, userName = '') {
    const defaultUser = window.t('farmer_fallback') || 'Farmer';
    const name = userName || defaultUser;
    const dateStr = new Date().toLocaleDateString();
    const logoUrl = window.location.origin + '/images/krishi_logo.png';
    
    // Create container
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = "'Outfit', 'Inter', sans-serif";
    element.style.color = '#1B261B';
    element.style.backgroundColor = '#ffffff';

    // PDF Styling
    element.innerHTML = `
        <div style="border: 2px solid #2D5A27; padding: 25px; border-radius: 12px; position: relative;">
            <!-- Header Section -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2D5A27; padding-bottom: 15px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${logoUrl}" style="height: 60px; width: auto; border-radius: 8px;" alt="Krishi Cure AI Logo">
                    <div>
                        <h1 style="color: #2D5A27; margin: 0; font-size: 24px; font-weight: 800;">Krishi Cure AI</h1>
                        <p style="margin: 3px 0 0 0; font-size: 13px; color: #4A5D4A; font-weight: 600;">Smart Agriculture Advisory Report</p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 13px; color: #4A5D4A;"><strong>Date:</strong> ${dateStr}</p>
                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #4A5D4A;"><strong>Farmer Name:</strong> ${name}</p>
                </div>
            </div>

            <!-- Title Section -->
            <div style="margin-bottom: 25px; text-align: center; background-color: #f1f7f2; padding: 15px; border-radius: 8px; border: 1px solid rgba(45, 90, 39, 0.1);">
                <h2 style="margin: 0; color: #2D5A27; font-size: 20px; font-weight: 700;">Crop Health & Diagnosis Prescription</h2>
                <p style="margin: 5px 0 0 0; font-size: 15px;"><strong>Crop Name:</strong> ${cropName}</p>
            </div>

            <!-- Grid details -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div style="border: 1px solid rgba(0,0,0,0.1); padding: 12px; border-radius: 8px; background: #fafafa;">
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold;">Identified Issue</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 700; color: #b91c1c;">${diagnosisData.disease_name}</p>
                </div>
                <div style="border: 1px solid rgba(0,0,0,0.1); padding: 12px; border-radius: 8px; background: #fafafa;">
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; font-weight: bold;">Confidence & Severity</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 700;">
                        Confidence: ${diagnosisData.confidence_score}% (${diagnosisData.confidence_level || 'Medium'}) | 
                        Severity: <span style="color: ${diagnosisData.severity_color === 'Red' ? '#b91c1c' : diagnosisData.severity_color === 'Yellow' ? '#b45309' : '#047857'}">${diagnosisData.severity_color || 'Yellow'}</span>
                    </p>
                </div>
            </div>

            <!-- Health indicators -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 25px;">
                <div style="border: 1px solid rgba(0,0,0,0.08); padding: 10px; border-radius: 6px; text-align: center; background: #fdfdfd;">
                    <span style="font-size: 11px; color: #777; display: block; font-weight: bold; text-transform: uppercase;">Crop Health Score</span>
                    <strong style="font-size: 16px; color: #2D5A27;">${diagnosisData.crop_health_score || 80}/100</strong>
                </div>
                <div style="border: 1px solid rgba(0,0,0,0.08); padding: 10px; border-radius: 6px; text-align: center; background: #fdfdfd;">
                    <span style="font-size: 11px; color: #777; display: block; font-weight: bold; text-transform: uppercase;">Risk Level</span>
                    <strong style="font-size: 16px; color: #b45309;">${diagnosisData.risk_level || 'Medium'}</strong>
                </div>
                <div style="border: 1px solid rgba(0,0,0,0.08); padding: 10px; border-radius: 6px; text-align: center; background: #fdfdfd;">
                    <span style="font-size: 11px; color: #777; display: block; font-weight: bold; text-transform: uppercase;">Yield Impact</span>
                    <strong style="font-size: 16px; color: #b91c1c;">${diagnosisData.yield_impact || 'Low'}</strong>
                </div>
            </div>

            <!-- Explanation & Symptoms -->
            <div style="margin-bottom: 20px;">
                <h3 style="color: #2D5A27; font-size: 15px; margin: 0 0 8px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 4px;">Explanation</h3>
                <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #333;">${diagnosisData.disease_explanation || 'No additional explanation provided.'}</p>
            </div>

            <!-- Treatments Tabbed content presented sequentially in PDF -->
            <div style="margin-bottom: 20px;">
                <h3 style="color: #2D5A27; font-size: 15px; margin: 0 0 8px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 4px;">🌿 Organic Care Plan</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
                    ${(diagnosisData.organic_treatment || []).map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #2D5A27; font-size: 15px; margin: 0 0 8px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 4px;">🧪 Emergency Chemical Advisory</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
                    ${(diagnosisData.chemical_treatment || []).map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #2D5A27; font-size: 15px; margin: 0 0 8px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 4px;">🛡️ Prevention & Nutrition</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6;">
                    ${(diagnosisData.prevention_methods || []).map(step => `<li>${step}</li>`).join('')}
                </ul>
                <div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div style="background: #fdfefd; border: 1px solid #e8f0e9; padding: 10px; border-radius: 6px;">
                        <span style="font-size: 11px; color: #4A5D4A; font-weight: bold; display: block;">Fertilizer Info:</span>
                        <span style="font-size: 12px; color: #2D5A27;">${diagnosisData.fertilizer_suggestions || 'N/A'}</span>
                    </div>
                    <div style="background: #fdfefd; border: 1px solid #e8f0e9; padding: 10px; border-radius: 6px;">
                        <span style="font-size: 11px; color: #4A5D4A; font-weight: bold; display: block;">Watering Info:</span>
                        <span style="font-size: 12px; color: #2D5A27;">${diagnosisData.irrigation_recommendations || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <!-- Recovery & Weather -->
            <div style="margin-bottom: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <h3 style="color: #2D5A27; font-size: 14px; margin: 0 0 6px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 2px;">📈 Recovery Forecast</h3>
                    <p style="margin: 3px 0; font-size: 12.5px;">Chances: <strong>${diagnosisData.recovery_details?.chances || 'Medium'}</strong></p>
                    <p style="margin: 3px 0; font-size: 12.5px;">Time: <strong>${diagnosisData.recovery_details?.time || 'N/A'}</strong></p>
                    <p style="margin: 3px 0; font-size: 12.5px; color: #b91c1c;">Warning: ${diagnosisData.recovery_details?.unrecoverable_signs || 'N/A'}</p>
                </div>
                <div>
                    <h3 style="color: #2D5A27; font-size: 14px; margin: 0 0 6px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 2px;">🌤️ Weather & Extension Warning</h3>
                    <p style="margin: 3px 0; font-size: 12.5px;">Weather Advice: <strong>${diagnosisData.weather_precautions || 'N/A'}</strong></p>
                    <p style="margin: 3px 0; font-size: 12.5px;">Immediate Step: <strong>${diagnosisData.nearest_action || 'N/A'}</strong></p>
                </div>
            </div>

            <!-- Footer block -->
            <div style="text-align: center; border-top: 2px solid #2D5A27; padding-top: 15px; margin-top: 30px; font-size: 12px; color: #4A5D4A;">
                <p style="margin: 0; font-weight: 700;">Developed by Bhatiya Kajal</p>
                <p style="margin: 3px 0 0 0; font-size: 10px; color: #777;">Report generated by Krishi Cure AI engine. Verify advice with local agricultural experts.</p>
            </div>
        </div>
    `;

    // Download PDF
    const filename = `KrishiCureAI_Report_${cropName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
    const opt = {
        margin:       [10, 10, 10, 10],
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
};

window.downloadFertilizerReportPDF = function(fertData, cropName, userName = '') {
    const defaultUser = window.t('farmer_fallback') || 'Farmer';
    const name = userName || defaultUser;
    const dateStr = new Date().toLocaleDateString();
    const logoUrl = window.location.origin + '/images/krishi_logo.png';

    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = "'Outfit', 'Inter', sans-serif";
    element.style.color = '#1B261B';
    element.style.backgroundColor = '#ffffff';

    element.innerHTML = `
        <div style="border: 2px solid #2D5A27; padding: 25px; border-radius: 12px;">
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2D5A27; padding-bottom: 15px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${logoUrl}" style="height: 60px; width: auto; border-radius: 8px;" alt="Krishi Cure AI Logo">
                    <div>
                        <h1 style="color: #2D5A27; margin: 0; font-size: 24px; font-weight: 800;">Krishi Cure AI</h1>
                        <p style="margin: 3px 0 0 0; font-size: 13px; color: #4A5D4A; font-weight: 600;">Smart Fertilizer Calculation Report</p>
                    </div>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; font-size: 13px; color: #4A5D4A;"><strong>Date:</strong> ${dateStr}</p>
                    <p style="margin: 3px 0 0 0; font-size: 13px; color: #4A5D4A;"><strong>Farmer Name:</strong> ${name}</p>
                </div>
            </div>

            <!-- Title -->
            <div style="margin-bottom: 25px; text-align: center; background-color: #f1f7f2; padding: 15px; border-radius: 8px; border: 1px solid rgba(45, 90, 39, 0.1);">
                <h2 style="margin: 0; color: #2D5A27; font-size: 20px; font-weight: 700;">Fertilizer Recommendation Plan</h2>
                <p style="margin: 5px 0 0 0; font-size: 15px;"><strong>Target Crop:</strong> ${cropName}</p>
            </div>

            <!-- Input Details Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
                <thead>
                    <tr style="background-color: #2D5A27; color: white;">
                        <th style="padding: 10px; text-align: left; border: 1px solid #2D5A27;">Parameter</th>
                        <th style="padding: 10px; text-align: left; border: 1px solid #2D5A27;">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Fertilizer Selected</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${fertData.fertilizer_name}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Total Land Area</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${fertData.area.value} ${fertData.area.unit} (${fertData.area.hectares} Hectares)</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #2D5A27; font-size: 16px;">Recommended Total Qty</td>
                        <td style="padding: 10px; border: 1px solid #ddd; color: #2D5A27; font-size: 16px; font-weight: bold;">${fertData.quantity} KG</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Quantity Per Unit Area</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${fertData.quantity_per_unit} KG per ${fertData.area.unit}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Application Method & Schedule -->
            <div style="margin-bottom: 20px;">
                <h3 style="color: #2D5A27; font-size: 15px; margin: 0 0 8px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 4px;">🛠️ Method of Application</h3>
                <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #333;">${fertData.method}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="color: #2D5A27; font-size: 15px; margin: 0 0 8px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 4px;">📆 Application Schedule</h3>
                <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #333;">${fertData.schedule}</p>
            </div>

            <div style="margin-bottom: 25px;">
                <h3 style="color: #2D5A27; font-size: 15px; margin: 0 0 8px 0; border-bottom: 1px dashed #2D5A27; padding-bottom: 4px;">⚠️ Safety Precautions</h3>
                <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #b91c1c;">${fertData.precautions}</p>
            </div>

            <!-- General Recommendations -->
            <div style="margin-bottom: 25px; background-color: #fafafa; padding: 12px; border-radius: 8px; border: 1px solid #eee;">
                <h4 style="margin: 0 0 5px 0; color: #2D5A27; font-size: 13px;">General Recommendations:</h4>
                <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.4;">${fertData.recommendations}</p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; border-top: 2px solid #2D5A27; padding-top: 15px; margin-top: 30px; font-size: 12px; color: #4A5D4A;">
                <p style="margin: 0; font-weight: 700;">Developed by Bhatiya Kajal</p>
                <p style="margin: 3px 0 0 0; font-size: 10px; color: #777;">Report generated by Krishi Cure AI engine. Verify advice with local agricultural experts.</p>
            </div>
        </div>
    `;

    const filename = `KrishiCureAI_Fertilizer_${cropName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
    const opt = {
        margin:       [10, 10, 10, 10],
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
};
