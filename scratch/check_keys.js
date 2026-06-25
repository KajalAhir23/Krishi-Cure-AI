import fs from 'fs';
import path from 'path';

const cropsPath = './data/crops.json';
const data = JSON.parse(fs.readFileSync(cropsPath, 'utf8'));
const langStore = data.langStore;

console.log('Available languages in langStore:', Object.keys(langStore));

const enKeys = Object.keys(langStore.en || {});
const hiKeys = Object.keys(langStore.hi || {});
const guKeys = Object.keys(langStore.gu || {});

console.log(`en keys: ${enKeys.length}, hi keys: ${hiKeys.length}, gu keys: ${guKeys.length}`);

// Find keys in en that are missing in hi or gu
const missingInHi = enKeys.filter(k => !hiKeys.includes(k));
const missingInGu = enKeys.filter(k => !guKeys.includes(k));

console.log('Missing in Hindi:', missingInHi);
console.log('Missing in Gujarati:', missingInGu);

