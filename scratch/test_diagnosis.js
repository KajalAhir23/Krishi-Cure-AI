import { diagnoseCropLocally } from '../data/diseaseDatabase.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
    const cropsDataPath = path.join(__dirname, '../data/crops.json');
    const data = await fs.readFile(cropsDataPath, 'utf8');
    const cropsData = JSON.parse(data);

    // Test case: Cotton with bacterial symptoms (angular black spots and water-soaked lesions)
    const result = diagnoseCropLocally(
        'cotton',
        'Cotton',
        ['sym_36', 'sym_37'],
        'gu',
        cropsData
    );

    console.log("TEST RESULT (GUJARATI):");
    console.log(JSON.stringify(result, null, 2));

    const resultEn = diagnoseCropLocally(
        'cotton',
        'Cotton',
        ['sym_36', 'sym_37'],
        'en',
        cropsData
    );

    console.log("\nTEST RESULT (ENGLISH):");
    console.log(JSON.stringify(resultEn, null, 2));
}

runTest().catch(console.error);
