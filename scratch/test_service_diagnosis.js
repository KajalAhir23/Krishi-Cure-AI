import dotenv from 'dotenv';
dotenv.config();
import { aiService } from '../server/services/aiService.js';

async function run() {
  console.log("Calling aiService.generateDiagnosis directly...");
  try {
    const result = await aiService.generateDiagnosis({
      cropName: "Cotton",
      symptoms: ["angular black spots", "water-soaked lesions"],
      lang: "en"
    });
    console.log("Success! Result:", result);
  } catch (error) {
    console.error("Direct Call Failed with error:", error);
  }
}

run();
