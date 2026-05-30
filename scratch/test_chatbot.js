import dotenv from 'dotenv';
dotenv.config();
import { chatWithAI } from '../controllers/aiController.js';

async function test() {
    console.log("Testing chatbot...");
    try {
        const response = await chatWithAI("Hello, how are you?", "en", []);
        console.log("Response:", response);
    } catch (e) {
        console.error("Test Error:", e);
    }
}
test();
