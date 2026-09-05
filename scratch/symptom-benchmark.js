/**
 * ============================================================
 * Krishi Cure AI — Symptom-Based Diagnosis Benchmark
 * ------------------------------------------------------------
 * NO DOWNLOAD NEEDED. NO IMAGES. NO GBs OF DATA.
 *
 * This script builds its OWN test dataset directly from your
 * app's existing data/crops.json (every crop already has a
 * curated list of valid symptoms attached to it) and then runs
 * those symptom combinations through your real diagnoseWithAI()
 * function to measure how well it classifies the underlying
 * disease category.
 *
 * HOW IT WORKS:
 *   1. For each crop, group its known symptoms into 5 categories
 *      (fungal / bacterial / viral / pest / nutrient) using
 *      keyword matching — the same style of logic your own
 *      data/diseaseDatabase.js already uses internally.
 *   2. For each category that has enough symptoms for a crop,
 *      build a test case: "if a farmer picks these symptoms,
 *      the disease SHOULD be classified as <category>".
 *   3. Send those symptoms to your real diagnoseWithAI() (the
 *      same function your live symptoms.html page calls).
 *   4. Classify the AI's returned disease name/explanation using
 *      the same keyword logic, and check if it agrees with the
 *      expected category.
 *
 * This covers ALL crops in your app (not just the 18 with public
 * image datasets) because it's just text — completely free of
 * the disk-space/download problem you were hitting.
 *
 * HOW TO RUN (from project root):
 *   node scratch/symptom-benchmark.js
 *
 * Optional flags:
 *   node scratch/symptom-benchmark.js --cropsLimit=15 --delayMs=2000
 *   (cropsLimit = how many crops to sample, default 20 — raise
 *    once you trust it; delayMs = pause between API calls)
 *
 * OUTPUT:
 *   scratch/symptom-benchmark-results.csv
 *   scratch/symptom-benchmark-summary.json
 * ============================================================
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { diagnoseWithAI } from '../controllers/aiController.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const CROPS_JSON_PATH = path.resolve(__dirname, '../data/crops.json');
const RESULTS_CSV = path.join(__dirname, 'symptom-benchmark-results.csv');
const SUMMARY_JSON = path.join(__dirname, 'symptom-benchmark-summary.json');

// ---- CLI args ----
const args = Object.fromEntries(
    process.argv.slice(2).map(a => {
        const [k, v] = a.replace(/^--/, '').split('=');
        return [k, v];
    })
);
const CROPS_LIMIT = parseInt(args.cropsLimit, 10) || 20;
const DELAY_MS = parseInt(args.delayMs, 10) || 2000;
const MIN_SYMPTOMS_PER_CATEGORY = 2; // skip category if crop has fewer than this many matching symptoms

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---- Same-spirit category classifier as data/diseaseDatabase.js's getSymptomCategory() ----
// (Re-implemented here, read-only, so this script never touches your real backend file.)
function classifyText(text) {
    const t = (text || '').toLowerCase();

    if (/(larvae|borer|mealybug|aphid|whitefly|pest|insect|worm|caterpillar|bug|mite|thrip|hole|scale|gall|locust|beetle|weevil|hopper|jassid|armyworm|bollworm|grub|miner)/.test(t)) {
        return 'pest';
    }
    if (/(curl|mosaic|clearing|banding|virus|mottling|dwarf|streak|witches|enation|distortion)/.test(t)) {
        return 'viral';
    }
    if (/(bacterial|ooze|canker|black rot|wilt|water-soaked|water soaked)/.test(t)) {
        return 'bacterial';
    }
    if (/(fungal|mold|blight|rot|rust|mildew|spot|lesion|dieback|scab|smut|damping|blast|anthracnose|scurf|powdery|ring|concentric|decay|coating)/.test(t)) {
        return 'fungal';
    }
    if (/(deficiency|chlorosis|yellowing|stunt|purple|pale|burn|cracking|splitting|shedding|yellow)/.test(t)) {
        return 'nutrient';
    }
    return 'unknown';
}

function loadTestCases(cropsData, limit) {
    const symptomById = Object.fromEntries(cropsData.symptomsList.map(s => [s.id, s]));
    const testCases = [];

    let cropsProcessed = 0;
    for (const category of Object.keys(cropsData.cropsList)) {
        for (const crop of cropsData.cropsList[category]) {
            if (cropsProcessed >= limit) break;

            const bySymptomCategory = { fungal: [], bacterial: [], viral: [], pest: [], nutrient: [] };
            for (const symId of (crop.symptoms || [])) {
                const symptom = symptomById[symId];
                if (!symptom) continue;
                const cat = classifyText(symptom.en);
                if (bySymptomCategory[cat]) bySymptomCategory[cat].push(symptom.en);
            }

            let addedAnyForThisCrop = false;
            for (const [expectedCategory, symptomTexts] of Object.entries(bySymptomCategory)) {
                if (symptomTexts.length >= MIN_SYMPTOMS_PER_CATEGORY) {
                    testCases.push({
                        cropName: crop.en,
                        expectedCategory,
                        symptoms: symptomTexts.slice(0, 4) // cap at 4 symptoms per test case
                    });
                    addedAnyForThisCrop = true;
                }
            }
            if (addedAnyForThisCrop) cropsProcessed++;
        }
        if (cropsProcessed >= limit) break;
    }
    return testCases;
}

async function main() {
    if (!fs.existsSync(CROPS_JSON_PATH)) {
        console.error(`\n❌ Could not find data/crops.json at ${CROPS_JSON_PATH}\n`);
        process.exit(1);
    }
    if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
        console.error('\n❌ Neither GROQ_API_KEY nor GEMINI_API_KEY found in your .env\n');
        process.exit(1);
    }

    const cropsData = JSON.parse(fs.readFileSync(CROPS_JSON_PATH, 'utf8'));
    const testCases = loadTestCases(cropsData, CROPS_LIMIT);

    console.log(`\n🧪 Auto-generated ${testCases.length} symptom test cases from ${CROPS_LIMIT} crops (no download needed).\n`);

    const results = [];
    let correct = 0;

    for (let i = 0; i < testCases.length; i++) {
        const { cropName, expectedCategory, symptoms } = testCases[i];
        process.stdout.write(`[${i + 1}/${testCases.length}] ${cropName} (expect: ${expectedCategory}) — [${symptoms.join(' | ')}]... `);

        try {
            const result = await diagnoseWithAI(cropName, symptoms, null, 'en');
            const predictedText = `${result.disease_name || ''} ${result.disease_explanation || ''}`;
            const predictedCategory = classifyText(predictedText);
            const match = predictedCategory === expectedCategory;
            if (match) correct++;

            results.push({
                cropName, expectedCategory, symptoms: symptoms.join(' | '),
                predictedDisease: result.disease_name || 'N/A',
                predictedCategory, match: match ? 'YES' : 'NO'
            });

            console.log(`${match ? '✅' : '❌'} "${result.disease_name}" → classified as ${predictedCategory}`);
        } catch (err) {
            console.log(`⚠️  ERROR: ${err.message}`);
            results.push({
                cropName, expectedCategory, symptoms: symptoms.join(' | '),
                predictedDisease: 'ERROR', predictedCategory: 'ERROR', match: 'ERROR'
            });
        }

        await sleep(DELAY_MS);
    }

    // ---- Write CSV ----
    const csvHeader = 'cropName,expectedCategory,symptoms,predictedDisease,predictedCategory,match\n';
    const csvBody = results.map(r =>
        [r.cropName, r.expectedCategory, `"${r.symptoms.replace(/"/g, "'")}"`, `"${(r.predictedDisease || '').replace(/"/g, "'")}"`, r.predictedCategory, r.match].join(',')
    ).join('\n');
    fs.writeFileSync(RESULTS_CSV, csvHeader + csvBody);

    // ---- Summary ----
    const validCount = results.filter(r => r.match !== 'ERROR').length;
    const overallAccuracy = validCount > 0 ? (correct / validCount) * 100 : 0;

    const byCategory = {};
    for (const r of results) {
        if (r.match === 'ERROR') continue;
        byCategory[r.expectedCategory] = byCategory[r.expectedCategory] || { total: 0, correct: 0 };
        byCategory[r.expectedCategory].total++;
        if (r.match === 'YES') byCategory[r.expectedCategory].correct++;
    }
    const perCategoryAccuracy = Object.fromEntries(
        Object.entries(byCategory).map(([cat, { total, correct }]) => [
            cat, `${((correct / total) * 100).toFixed(1)}% (${correct}/${total})`
        ])
    );

    const summary = {
        totalTestCases: testCases.length,
        cropsCovered: CROPS_LIMIT,
        errors: results.filter(r => r.match === 'ERROR').length,
        overallAccuracy: `${overallAccuracy.toFixed(1)}%`,
        correctPredictions: correct,
        validPredictions: validCount,
        perCategoryAccuracy,
        note: 'This tests whether the AI\'s diagnosed disease matches the EXPECTED DISEASE CATEGORY (fungal/bacterial/viral/pest/nutrient) implied by the symptoms selected — not an exact named-disease match. Auto-generated from data/crops.json, no external dataset required. Review the CSV manually before quoting this number publicly.'
    };
    fs.writeFileSync(SUMMARY_JSON, JSON.stringify(summary, null, 2));

    console.log('\n============================================');
    console.log(`✅ DONE — Overall accuracy: ${summary.overallAccuracy}`);
    console.log(`   (${correct}/${validCount} correct, ${summary.errors} errors)`);
    console.log('============================================');
    console.log('\nPer-category breakdown:');
    console.table(perCategoryAccuracy);
    console.log(`\n📄 Full results: scratch/symptom-benchmark-results.csv`);
    console.log(`📄 Summary:      scratch/symptom-benchmark-summary.json\n`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
