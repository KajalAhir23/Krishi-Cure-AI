# 🌾 Krishi Cure AI

> An AI-powered smart agriculture application helping farmers identify crop diseases and get professional treatment suggestions using artificial intelligence in multiple languages.

[![Node.js](https://img.shields.io/badge/Node.js-v16%2B-green)]()
[![Express.js](https://img.shields.io/badge/Express.js-v5-blue)]()
[![License](https://img.shields.io/badge/License-ISC-yellow)]()

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Krishi Cure AI is a professional-grade web application designed to help farmers across India identify crop diseases and receive accurate treatment recommendations. The application uses advanced AI models (Groq Llama and Google Gemini) to provide diagnosis and advice in three languages: English, Hindi, and Gujarati.

**Key Benefits:**
- ✅ Accurate AI-powered disease diagnosis
- ✅ Multi-language support for accessibility
- ✅ Voice-enabled interaction
- ✅ Weather integration
- ✅ Fertilizer calculation tools
- ✅ Complete responsive design

## ✨ Features

### Core Features
- 🌱 **Crop Disease Detection** - Identify diseases from symptoms or images
- 📷 **Image Upload Analysis** - Upload 1-4 images for AI analysis
- 🤖 **AI Chatbot** - General agriculture Q&A assistance
- 🌐 **Multi-language Support** - English, Hindi, Gujarati
- 🔐 **Google Authentication** - Secure login
- 🌦️ **Weather Information** - Live weather integration
- 🗺️ **Location Services** - Automatic and manual location detection
- 🎤 **Voice Support** - Voice-enabled interactions
- 📊 **Fertilizer Calculator** - Calculate fertilizer requirements by area
- 📄 **PDF Reports** - Generate diagnosis reports
- 📱 **Fully Responsive** - Works on desktop, tablet, mobile

## 🌿 Supported Categories

### Field Crops

* Cotton
* Groundnut
* Wheat
* Rice
* Bajra
* Jowar
* Maize
* Sugarcane
* Castor
* Sesame
* Mustard
* Pulses
* Soybean
* Cumin
* Fennel
* Coriander
* Onion
* Garlic
* Chilli
* Sunflower
* and more...

### Fruits

* Mango
* Banana
* Papaya
* Pomegranate
* Guava
* Chikoo
* Lemon
* Orange
* Grapes
* Dragon Fruit
* Coconut
* Avocado
* and more...

### Vegetables

* Potato
* Tomato
* Brinjal
* Okra
* Cabbage
* Cauliflower
* Bottle Gourd
* Pumpkin
* Cucumber
* Capsicum
* Carrot
* Beetroot
* Spinach
* Ginger
* and more...

## 📷 Image-Based Disease Detection

Farmers can identify crop diseases by uploading images of affected plants.

### How It Works

1. Select Crop
2. Upload 1–4 Images
3. (Optional) Select Symptoms
4. AI Analyzes Images
5. Get Disease Prediction
6. View Recovery Suggestions

### Supported Uploads

* Mobile Camera Capture
* Mobile Gallery Upload
* Desktop Image Upload

### AI Analysis

* Disease Detection
* Pest Identification
* Nutrient Deficiency Detection
* Recovery Recommendations
* Prevention Guidance

## 🤖 AI Agriculture Chatbot

Farmers can ask agriculture-related questions and receive instant AI-powered guidance.

Examples:

* Crop diseases
* Pest management
* Fertilizer recommendations
* Irrigation advice
* Weather-based crop care
* Soil management

### 🎤 Voice Support

* Speak instead of typing
* Supports Gujarati, Hindi, and English
* Real-time speech-to-text conversion
* Farmer-friendly interaction

## 🌦️ Weather Module

Provides:

* Live temperature
* Humidity
* Wind speed
* Weather conditions
* Auto location detection
* Manual location selection
* Weather-based farming insights

## 🌱 Fertilizer Calculator

The Fertilizer Calculator helps farmers estimate fertilizer requirements based on crop type and farm area.

### Features

* Crop-wise fertilizer recommendations
* Support for:

  * Bigha
  * Acre
  * Hectare
* Area-based fertilizer calculation
* Recommended fertilizer quantities
* Application schedule guidance

### How It Works

1. Select Crop
2. Select Area Unit (Bigha/Acre/Hectare)
3. Enter Area
4. Calculate Fertilizer Requirement
5. Get Recommendations

### Output

* Urea Requirement
* DAP Requirement
* Potash Requirement
* Application Schedule
* Farming Recommendations

## 📈 How Krishi Cure AI Works

1. Sign in with Google
2. Select Crop Category
3. Select Crop
4. Upload 1–4 Images
5. (Optional) Select Symptoms
6. Get AI Disease Prediction
7. View Risk Analysis
8. Receive Treatment Suggestions
9. Check Weather Conditions
10. Ask Questions using AI Chatbot
11. Type or Speak using Voice Input
12. Open Fertilizer Calculator
13. Enter Crop and Area Details
14. Get Fertilizer Recommendations

### Supported Crops

**Field Crops:** Cotton, Groundnut, Wheat, Rice, Bajra, Jowar, Maize, Sugarcane, Castor, Sesame, Mustard, Pulses, Soybean, Cumin, Fennel, Coriander, Onion, Garlic, Chilli, Sunflower

**Fruits:** Mango, Banana, Papaya, Pomegranate, Guava, Chikoo, Lemon, Orange, Grapes, Dragon Fruit, Coconut, Avocado

**Vegetables:** Potato, Tomato, Brinjal, Okra, Cabbage, Cauliflower, Bottle Gourd, Pumpkin, Cucumber, Capsicum, Carrot, Beetroot, Spinach, Ginger

## 📁 Project Structure

```\nkrishi-cure-ai/\n├── server/                          # Backend\n│   ├── config/                      # Configuration\n│   │   ├── constants.js            # App constants\n│   │   └── environment.js          # Environment variables\n│   ├── controllers/                 # Route controllers\n│   │   ├── dataController.js       # Master data endpoints\n│   │   ├── diagnosisController.js  # Disease diagnosis\n│   │   ├── chatbotController.js    # Chatbot logic\n│   │   └── fertilizerController.js # Fertilizer calculations\n│   ├── services/                    # Business logic\n│   │   ├── aiService.js            # AI integration (Groq/Gemini)\n│   │   ├── dataService.js          # Data management\n│   │   └── fertilizerService.js    # Fertilizer calculations\n│   ├── validators/                  # Input validation\n│   │   └── inputValidator.js       # Request validation\n│   ├── utils/                       # Utilities\n│   │   ├── errorHandler.js         # Error handling\n│   │   ├── middleware.js           # Custom middleware\n│   │   └── validationMiddleware.js # Validation middleware\n│   ├── middlewares/                 # Express middleware\n│   │   └── rateLimiter.js          # Rate limiting\n│   └── routes/                      # API routes\n│       └── api.js                   # Main API routes\n│\n├── src/                             # Frontend\n│   ├── components/                  # Reusable components\n│   ├── services/                    # API services\n│   │   └── apiService.js           # Frontend API client\n│   ├── utils/                       # Frontend utilities\n│   │   └── helpers.js              # Helper functions\n│   └── constants/                   # Frontend constants\n│       └── uiConstants.js          # UI constants\n│\n├── public/                          # Static assets\n│   ├── index.html, login.html, etc.\n│   ├── js/                          # Frontend JavaScript\n│   └── css/                         # Stylesheets\n│\n├── data/                            # Data files\n│   └── crops.json                   # Crops database\n│\n├── .env.example                     # Environment variables template\n├── package.json                     # Project dependencies\n├── server.js                        # Server entry point\n├── README.md                        # This file\n└── vercel.json                      # Deployment config\n```\n\n## 🛠️ Technology Stack\n\n**Backend:**\n- Node.js v16+\n- Express.js v5\n- Groq API (LLaMA 3.3 70B)\n- Google Gemini API\n- dotenv (environment management)\n\n**Frontend:**\n- HTML5\n- CSS3\n- Vanilla JavaScript\n- Firebase Authentication\n- Responsive Design\n\n**APIs & Services:**\n- Google Firebase Auth\n- Groq API\n- Google Generative AI API\n\n## 📦 Installation\n\n### Prerequisites\n\n- Node.js v16 or higher\n- npm v8 or higher\n- Git\n\n### Step 1: Clone Repository\n\n```bash\ngit clone https://github.com/yourusername/krishi-cure-ai.git\ncd krishi-cure-ai\n```\n\n### Step 2: Install Dependencies\n\n```bash\nnpm install\n```\n\n### Step 3: Environment Configuration\n\n```bash\ncp .env.example .env\n# Edit .env with your API keys\n```\n\n## ⚙️ Configuration\n\n### Environment Variables\n\nCreate a `.env` file:\n\n```env\nPORT=3000\nNODE_ENV=development\nCORS_ORIGIN=*\nGROQ_API_KEY=your_groq_api_key\nGEMINI_API_KEY=your_gemini_api_key\nFIREBASE_API_KEY=your_firebase_key\nFIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com\n```\n\n### Getting API Keys\n\n**Groq API:** Visit [Groq Console](https://console.groq.com)\n\n**Gemini API:** Visit [Google AI Studio](https://makersuite.google.com/app/apikey)\n\n**Firebase:** Visit [Firebase Console](https://console.firebase.google.com)\n\n## 🚀 Running Locally\n\n```bash\n# Development mode\nnpm start\n\n# Watch mode (auto-reload)\nnpm run dev\n```\n\nServer runs on `http://localhost:3000`\n\n## 📚 API Documentation\n\n### Base URL: `http://localhost:3000/api`\n\n#### GET /data\nReturns master data (crops, symptoms, translations)\n\n#### POST /diagnose\nSymptom-based disease diagnosis\n```json\n{\n  \"cropId\": \"wheat\",\n  \"symptoms\": [\"symptom1\", \"symptom2\"],\n  \"lang\": \"en\"\n}\n```\n\n#### POST /diagnose-image\nImage-based disease diagnosis\n```json\n{\n  \"cropId\": \"wheat\",\n  \"images\": [\"base64_image_1\"],\n  \"lang\": \"en\"\n}\n```\n\n#### POST /chatbot\nAgriculture Q&A chatbot\n```json\n{\n  \"question\": \"How to grow wheat?\",\n  \"lang\": \"en\"\n}\n```\n\n#### POST /fertilizer/calculate\nCalculate fertilizer requirements\n```json\n{\n  \"cropId\": \"wheat\",\n  \"fertilizerId\": \"urea\",\n  \"areaUnit\": \"Acre\",\n  \"areaValue\": 5,\n  \"lang\": \"en\"\n}\n```\n\n## 👨‍💻 Development\n\n### Code Standards\n- Use meaningful variable names\n- Add JSDoc comments\n- Keep functions focused\n- Validate all inputs\n- Handle errors gracefully\n- Use environment variables\n\n### Adding Features\n1. Create service in `server/services/`\n2. Create controller in `server/controllers/`\n3. Add validation in `server/validators/`\n4. Add route in `server/routes/api.js`\n\n## ❓ Troubleshooting\n\n**Port already in use:**\n```bash\nlsof -ti:3000 | xargs kill -9  # macOS/Linux\n```\n\n**API Key errors:** Verify `.env` has correct keys\n\n**CORS errors:** Check `CORS_ORIGIN` setting\n\n## 🤝 Contributing\n\nContributions welcome! Please:\n1. Fork the repository\n2. Create feature branch\n3. Follow code standards\n4. Test changes locally\n5. Submit Pull Request\n\n## 📄 License\n\nISC License - See LICENSE file for details\n\n## 🙏 Acknowledgments\n\n- Groq for fast LLaMA inference\n- Google for Gemini API and Firebase\n- ICAR for agricultural guidance\n- All contributors\n\n---\n\n**Made with 🌾 for Indian Farmers**
* Farmer Dashboard

## 👩‍💻 Developer

Kajal Bhatiya

## 🔗 GitHub Repository

https://github.com/KajalAhir23/Krishi-Cure-AI
