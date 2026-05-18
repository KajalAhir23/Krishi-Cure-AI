# Krishi-Cure-AI

An advanced, AI-powered agricultural diagnostic system designed specifically for farmers.

## Major Project Features

- **AI Inference Engine:** Utilizes Google Gen AI (`@google/genai`) acting as a highly accurate Agricultural Scientist to diagnose crop diseases.
- **Dynamic Knowledge Base:** A robust `data/crops.json` engine containing 70+ crops mapped to 337 dynamically filtered symptoms.
- **Context-Specific Symptom Filtering:** The UI strictly filters and displays only the symptoms relevant to the selected crop.
- **Multi-Language Support (EN/HI/GU):** Fully localized interface and AI diagnosis output for Hindi and Gujarati farmers.
- **Text-To-Speech (TTS):** Integrated Web Speech API reads the step-by-step diagnostic organic remedy aloud to the user.
- **Organic Solutions (Prakrutik Kheti):** AI outputs localized, organic action plans like Jivamrut and Agniastra instead of harmful chemicals.
- **Instant Diagnosis Cache:** In-memory smart cache prevents redundant API calls and provides 0ms responses for recurring symptoms.

## Tech Stack
- **Backend:** Node.js, Express.js
- **AI Engine:** Google Gemini AI API (`gemini-2.5-flash`)
- **Frontend:** Vanilla HTML/CSS/JS (SPA without heavy frameworks)
- **Database:** Local JSON Knowledge Base (`fs.promises`)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/KajalAhir23/Krishi-Cure-AI.git
   cd Krishi-Cure-AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000`.
