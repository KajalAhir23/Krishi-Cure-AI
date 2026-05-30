import dotenv from 'dotenv';
dotenv.config();
import { chatWithAI } from '../controllers/aiController.js';

async function test() {
    console.log("Testing chatbot with history...");
    try {
        const history = [
            { role: "user", content: "hello" }
        ];
        const response = await chatWithAI("hello", "en", history);
        console.log("Response:", response);
    } catch (e) {
        console.error("Test Error:", e);
    }
}
test();
