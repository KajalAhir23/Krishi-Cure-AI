/**
 * ============================================================
 * Krishi Cure AI — Diagnosis Accuracy Benchmark
 * ------------------------------------------------------------
 * Tests your EXISTING diagnoseImageWithAI() function against a
 * labeled dataset (e.g. PlantVillage) and reports accuracy.
 *
 * No changes to your app's architecture — this is a standalone
 * test script you run once and paste the results into your README.
 *
 * DATASET FOLDER STRUCTURE EXPECTED (this is how PlantVillage
 * ships on Kaggle):
 *
 *   dataset/
 *     Tomato___Early_blight/
 *       img1.JPG
 *       img2.JPG
 *     Tomato___healthy/
 *       img1.JPG
 *     Potato___Late_blight/
 *       img1.JPG
 *     ...
 *
 * Folder name format: "<Crop>___<Disease_or_healthy>"
 *
 * HOW TO RUN:
 *   1. Download a PlantVillage-style dataset from Kaggle, e.g.:
 *      https://www.kaggle.com/datasets/emmarex/plantdisease
 *   2. Unzip it and place/rename the top folder as: scratch/dataset
 *   3. Make sure your real .env (with GEMINI_API_KEY) is at the
 *      project root.
 *   4. From the project root run:
 *        node scratch/benchmark.js
 *   5. Optional flags:
 *        node scratch/benchmark.js --perClass=5 --maxTotal=100
 *      (defaults: 5 images per class, 100 images total — keeps
 *      API usage/cost low; raise these once you trust the script)
 *
 * OUTPUT:
 *   - Live progress in the console
 *   - scratch/benchmark-results.csv  (every prediction, row by row)
 *   - scratch/benchmark-summary.json (overall + per-crop accuracy)
 * ============================================================
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { diagnoseImageWithAI } from '../controllers/aiController.js';

dotenv.config({ path: path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../.env') });

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DATASET_DIR = path.join(__dirname, 'dataset');
const RESULTS_CSV = path.join(__dirname, 'benchmark-results.csv');
const SUMMARY_JSON = path.join(__dirname, 'benchmark-summary.json');

// ---- CLI args ----
const args = Object.fromEntries(
    process.argv.slice(2).map(a => {
        const [k, v] = a.replace(/^--/, '').split('=');
        return [k, v];
    })
);
const PER_CLASS_LIMIT = parseInt(args.perClass, 10) || 5;
const MAX_TOTAL = parseInt(args.maxTotal, 10) || 100;
const DELAY_MS = parseInt(args.delayMs, 10) || 2500; // be gentle on free-tier rate limits

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function toBase64(filePath) {
    const buf = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
    return { base64Data: buf.toString('base64'), mimeType };
}

// Turn "Tomato___Early_blight" into { crop: "Tomato", label: "early blight" }
function parseFolderName(folder) {
    const parts = folder.split('___');
    const crop = (parts[0] || folder).replace(/_/g, ' ').trim();
    const label = (parts[1] || 'unknown').replace(/_/g, ' ').trim().toLowerCase();
    return { crop, label };
}

// Very loose fuzzy match: does the AI's guess share meaningful
// words with the true label? LLM output won't exactly match
// dataset label strings, so exact match would be misleading.
function isMatch(predictedName, trueLabel) {
    if (!predictedName) return false;
    const norm = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const predWords = new Set(norm(predictedName));
    const trueWords = norm(trueLabel).filter(w => !['leaf', 'disease', 'spot', 'virus'].includes(w) || trueLabel.split(' ').length <= 2);

    if (trueLabel.includes('healthy')) {
        return norm(predictedName).some(w => ['healthy', 'none', 'no', 'normal'].includes(w));
    }
    return trueWords.some(w => w.length > 3 && [...predWords].some(p => p.includes(w) || w.includes(p)));
}

async function main() {
    if (!fs.existsSync(DATASET_DIR)) {
        console.error(`\n❌ Dataset folder not found at: ${DATASET_DIR}`);
        console.error(`   Download a PlantVillage-style dataset and place it at scratch/dataset/`);
        console.error(`   Expected structure: scratch/dataset/<Crop>___<Disease>/*.jpg\n`);
        process.exit(1);
    }
    if (!process.env.GEMINI_API_KEY) {
        console.error('\n❌ GEMINI_API_KEY not found in your .env — image diagnosis needs it.\n');
        process.exit(1);
    }

    const classFolders = fs.readdirSync(DATASET_DIR).filter(f =>
        fs.statSync(path.join(DATASET_DIR, f)).isDirectory()
    );

    if (classFolders.length === 0) {
        console.error('\n❌ No class folders found inside scratch/dataset/\n');
        process.exit(1);
    }

    console.log(`\n📂 Found ${classFolders.length} classes in dataset.`);
    console.log(`⚙️  Sampling up to ${PER_CLASS_LIMIT} images/class, ${MAX_TOTAL} images total.\n`);

    // Build the sample list
    const samples = [];
    for (const folder of classFolders) {
        const { crop, label } = parseFolderName(folder);
        const folderPath = path.join(DATASET_DIR, folder);
        const images = fs.readdirSync(folderPath)
            .filter(f => /\.(jpe?g|png)$/i.test(f))
            .slice(0, PER_CLASS_LIMIT);

        for (const img of images) {
            samples.push({ crop, label, filePath: path.join(folderPath, img), fileName: img });
        }
        if (samples.length >= MAX_TOTAL) break;
    }
    const finalSamples = samples.slice(0, MAX_TOTAL);
    console.log(`🧪 Running benchmark on ${finalSamples.length} images...\n`);

    const results = [];
    let correct = 0;

    for (let i = 0; i < finalSamples.length; i++) {
        const { crop, label, filePath, fileName } = finalSamples[i];
        process.stdout.write(`[${i + 1}/${finalSamples.length}] ${crop} / ${label} (${fileName})... `);

        try {
            const image = toBase64(filePath);
            const result = await diagnoseImageWithAI(crop, [image], [], 'en');

            const predicted = result.disease_name || 'N/A';
            const confidence = result.confidence_score ?? 'N/A';
            const match = isMatch(predicted, label);
            if (match) correct++;

            results.push({
                crop, trueLabel: label, fileName,
                predictedDisease: predicted, confidenceScore: confidence,
                match: match ? 'YES' : 'NO'
            });

            console.log(`${match ? '✅' : '❌'} predicted: "${predicted}" (conf: ${confidence})`);
        } catch (err) {
            console.log(`⚠️  ERROR: ${err.message}`);
            results.push({
                crop, trueLabel: label, fileName,
                predictedDisease: 'ERROR', confidenceScore: 'N/A', match: 'ERROR'
            });
        }

        await sleep(DELAY_MS);
    }

    // ---- Write CSV ----
    const csvHeader = 'crop,trueLabel,fileName,predictedDisease,confidenceScore,match\n';
    const csvBody = results.map(r =>
        [r.crop, r.trueLabel, r.fileName, `"${(r.predictedDisease || '').replace(/"/g, "'")}"`, r.confidenceScore, r.match].join(',')
    ).join('\n');
    fs.writeFileSync(RESULTS_CSV, csvHeader + csvBody);

    // ---- Per-crop summary ----
    const byCrop = {};
    for (const r of results) {
        if (r.match === 'ERROR') continue;
        byCrop[r.crop] = byCrop[r.crop] || { total: 0, correct: 0 };
        byCrop[r.crop].total++;
        if (r.match === 'YES') byCrop[r.crop].correct++;
    }
    const perCropAccuracy = Object.fromEntries(
        Object.entries(byCrop).map(([crop, { total, correct }]) => [
            crop, `${((correct / total) * 100).toFixed(1)}% (${correct}/${total})`
        ])
    );

    const validCount = results.filter(r => r.match !== 'ERROR').length;
    const overallAccuracy = validCount > 0 ? (correct / validCount) * 100 : 0;

    const summary = {
        totalImagesTested: finalSamples.length,
        errors: results.filter(r => r.match === 'ERROR').length,
        overallAccuracy: `${overallAccuracy.toFixed(1)}%`,
        correctPredictions: correct,
        validPredictions: validCount,
        perCropAccuracy,
        note: 'Match = loose keyword overlap between AI-predicted name and dataset label, NOT exact string match (LLM phrasing varies). Review benchmark-results.csv manually for edge cases before quoting this number publicly.'
    };
    fs.writeFileSync(SUMMARY_JSON, JSON.stringify(summary, null, 2));

    console.log('\n============================================');
    console.log(`✅ DONE — Overall accuracy: ${summary.overallAccuracy}`);
    console.log(`   (${correct}/${validCount} correct, ${summary.errors} errors)`);
    console.log('============================================');
    console.log('\nPer-crop breakdown:');
    console.table(perCropAccuracy);
    console.log(`\n📄 Full results: scratch/benchmark-results.csv`);
    console.log(`📄 Summary:      scratch/benchmark-summary.json\n`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});