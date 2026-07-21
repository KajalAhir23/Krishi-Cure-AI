<div align="center">

  <h1>🌾 Krishi Cure AI</h1>
  <h3><i>Empowering Agriculture through Multilingual Intelligence & AI Diagnostics</i></h3>

  <p>An AI-powered smart agriculture platform designed to help farmers identify crop diseases, receive personalized organic & chemical treatment plans, calculate precise fertilizer dosages, access hyper-local weather advisory, and consult an AI farming assistant in multiple regional languages.</p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-ai-disease-detection-workflow">Diagnosis Workflow</a> •
    <a href="#-technology-stack">Tech Stack</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-developer">Developer</a>
  </p>

</div>

---

## 🛡️ GitHub Badges

<div align="center">

  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
  ![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
  ![OpenWeather API](https://img.shields.io/badge/OpenWeather-EB6E4B?style=for-the-badge&logo=openweather&logoColor=white)
  ![Responsive Design](https://img.shields.io/badge/Responsive-Mobile_to_4K-4CAF50?style=for-the-badge&logo=responsive&logoColor=white)
  ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
  ![Stars](https://img.shields.io/github/stars/yourusername/krishi-cure-ai?style=for-the-badge&color=gold)
  ![Forks](https://img.shields.io/github/forks/yourusername/krishi-cure-ai?style=for-the-badge&color=blue)

</div>

---

## 📌 Project Overview

**Krishi Cure AI** is an advanced, multilingual, smart farming assistant built to bridge the gap between traditional agricultural knowledge and modern artificial intelligence. In modern farming, late disease detection, nutrient mismanagement, and unpredictable weather events cost farmers substantial crop loss every season.

### 💡 Why It Was Built
Many small-scale and regional farmers lack immediate access to agricultural experts or local diagnostic labs. Language barriers further restrict their ability to leverage digital tools. **Krishi Cure AI** provides instant, reliable, and localized diagnostic & advisory services in native regional languages directly on any device.

### 👥 Who It Helps & Problems Solved
- **Farmers & Agricultural Workers**: Get instant visual & symptom-based crop diagnosis without expensive lab visits.
- **Agricultural Advisors & Field Extension Workers**: Quickly assess crop health, recommend organic/chemical treatments, and calculate precise fertilizer bags needed.
- **Local Communities**: Reduces excessive chemical pesticide usage by offering safe organic alternatives and preventive care strategies.

---

## ✨ Key Features

| Feature Category | Description & Capabilities |
| :--- | :--- |
| **🤖 Multimodal AI Disease Detection** | Upload up to 4 high-resolution plant photos for visual AI analysis using Google Gemini. |
| **📋 Manual Symptom Selection** | Interactive checklist categorized by Leaf, Stem, Flower, Fruit, and Root symptoms. |
| **🔬 Hybrid Diagnosis Engine** | Combines image visual inspection with user-selected symptoms for higher prediction accuracy. |
| **📊 Confidence Score & Ranking** | Displays top matching diseases with percentage accuracy and safety confidence indicators. |
| **🌿 Organic Treatment Plan** | Step-by-step eco-friendly bio-pesticide, neem oil, and compost remedies. |
| **🧪 Chemical Emergency Plan** | Safe, emergency-only chemical fungicide and pesticide application steps. |
| **🛡️ Prevention & Recovery Care** | Irrigation adjustments, weather precautions, and estimated recovery timeframes. |
| **☀️ Smart Weather Advisory** | Hyper-local weather conditions, humidity, rain probability, wind speed, and agricultural safety alerts. |
| **🧮 Fertilizer Calculator** | Calculates exact Urea, DAP, Potash, and organic manure requirements based on crop & area size. |
| **🔐 Google Authentication** | One-tap secure user authentication using Firebase Auth. |
| **💬 AI Agriculture Chatbot** | Real-time AI consultation assistant to answer queries regarding crops, soil health, and pest control. |
| **🌍 Native Multilingual Support** | Seamless real-time language switching between English, Hindi (हिन्दी), and Gujarati (ગુજરાતી). |
| **📱 100% Fully Responsive UI** | Custom fluid CSS grid and flex layout optimized for 320px mobile phones up to 4K monitors. |

---

## 🌐 Supported Languages

**Krishi Cure AI** provides complete multi-language internationalization across every page, UI component, dynamic text banner, dynamic diagnosis result, and chatbot response:

- 🇬🇧 **English**
- 🇮🇳 **Hindi (हिन्दी)**
- 🇮🇳 **Gujarati (ગુજરાતી)**

> [!TIP]
> The language selection preference is persisted across browser sessions and automatically translates disease remedies, weather alerts, fertilizer calculations, and AI chatbot responses dynamically.

---

## 🌾 Supported Crop Categories

The platform supports a vast matrix of regional and international crops divided into 3 primary categories:

```
                  ┌──────────────────────────────┐
                  │   Supported Crop Categories  │
                  └──────────────┬───────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Field Crops   │     │   Vegetables    │     │     Fruits      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ Wheat           │     │ Tomato          │     │ Apple           │
│ Cotton          │     │ Potato          │     │ Banana          │
│ Paddy / Rice    │     │ Onion           │     │ Mango           │
│ Maize (Corn)    │     │ Chilli / Pepper │     │ Citrus / Orange │
│ Sugarcane       │     │ Eggplant        │     │ Papaya          │
│ Groundnut       │     │ Cabbage         │     │ Guava           │
│ Groundnut / Soy │     │ Cucumber        │     │ Pomegranate     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 🔄 AI Disease Detection Workflow

Below is the end-to-end user workflow for diagnosing crop health within the application:

```
 ┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
 │  User Login  │ ───> │ Select Crop  │ ───> │ Choose Diagnosis │
 └──────────────┘      └──────────────┘      └────────┬─────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
             ┌──────────────────┐                                          ┌──────────────────┐
             │  Upload Photos   │                                          │ Select Symptoms  │
             │  (Up to 4 slots) │                                          │  (Manual Grid)   │
             └────────┬─────────┘                                          └────────┬─────────┘
                      │                                                             │
                      └──────────────────────────────┬──────────────────────────────┘
                                                     ▼
                                       ┌───────────────────────────┐
                                       │   Multimodal Gemini AI    │
                                       │    Diagnostic Analysis    │
                                       └─────────────┬─────────────┘
                                                     │
                                                     ▼
                                       ┌───────────────────────────┐
                                       │ Prediction & Confidence   │
                                       │ Score (% Accuracy & Risk) │
                                       └─────────────┬─────────────┘
                                                     │
                                                     ▼
                                       ┌───────────────────────────┐
                                       │  Scientific Remedies &    │
                                       │ Organic/Chemical Actions  │
                                       └─────────────┬─────────────┘
                                                     │
                                  ┌──────────────────┴──────────────────┐
                                  ▼                                     ▼
                      ┌──────────────────────┐              ┌──────────────────────┐
                      │ Hyper-Local Weather  │              │ Fertilizer Dosage &  │
                      │  Advisory & Alerts   │              │ Application Schedule │
                      └──────────────────────┘              └──────────────────────┘
```

---

## ☀️ Weather Advisory Module

The **Weather Care Advisory Module** provides real-time atmospheric insights tailored to agricultural crop protection:

- **GPS Auto-Location**: Detects the user's current coordinates using HTML5 Geolocation.
- **Interactive Manual Location Picker**: Built-in Leaflet map and Nominatim search for selecting custom villages, districts, or cities.
- **Meteorological Indicators**:
  - 🌡️ **Temperature & Feels-Like Value**
  - 💧 **Relative Air Humidity (%)**
  - ☔ **Rain Fall Probability (%)**
  - 💨 **Wind Speed (km/h)**
  - ⏲️ **Atmospheric Pressure (hPa)**
  - 👁️ **Sight Visibility (km)**
  - 🌅 **Sunrise & Sunset Times**
- **Automated Agriculture Warnings**:
  - **Fungal Alert**: Triggered when humidity >80% and temperature is between 20°C–30°C.
  - **Irrigation Advice**: Recommends delaying or increasing watering depending on rainfall and soil evaporation.
  - **Spray Safety Alert**: Warns against spraying pesticides during strong wind speeds (>22 km/h).

---

## 🧮 Fertilizer Calculator Module

The **Smart Fertilizer Calculator** enables farmers to calculate precise fertilizer dosages to prevent soil degradation and over-fertilization:

### Inputs Required
1. **Target Crop**: Select from crops database.
2. **Fertilizer Type**: Select Urea, DAP (Di-Ammonium Phosphate), MOP (Muriate of Potash), Zinc, or NPK blends.
3. **Land Area Value**: Enter numerical area size.
4. **Area Unit**: Supports **Acre**, **Hectare**, and **Bigha** (regional conversion factors applied automatically).

### Outputs Calculated
- 📦 **Recommended Fertilizer Dosage**: Exact weight in Kilograms (kg) and equivalent standard 45kg/50kg commercial bags.
- 📆 **Application Schedule**: Split dosage timelines (Basal Application, Vegetative Stage, Flowering Stage).
- 🛠️ **Method of Application**: Top-dressing, foliar spray, or band placement guidance.
- ⚠️ **Soil Precautions**: Environmental safety instructions to maintain soil fertility.

---

## 💬 AI Agriculture Chatbot

The floating **Krishi Cure AI Assistant** acts as a 24/7 digital agronomist:

- **Domain Knowledge**: Trained to assist with crop diseases, pest identification, weed management, seasonal crop calendars, and soil nutrients.
- **Multilingual Dialogue**: Comprehends and responds fluently in English, Hindi, and Gujarati based on active site language settings.
- **Context Awareness**: Remembers recent conversation turns during the session to provide relevant follow-up advice.

---

## 🛠️ Technology Stack

<div align="center">

| Component | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend Core** | HTML5, CSS3, JavaScript (ES6+) | Vanilla architecture for maximum performance and zero framework bloat. |
| **Styling & System** | Custom Vanilla CSS (Design Tokens) | Glassmorphism UI, Outfit/Inter typography, fluid clamp units. |
| **Backend Runtime** | Node.js (v16+) & Express.js (v5) | Enterprise REST API routes, request sanitization, rate limiting. |
| **Artificial Intelligence**| Google Gemini AI SDK (`@google/genai`) | Multimodal vision analysis & natural language conversation engine. |
| **Authentication** | Firebase Auth SDK (Compat v9) | One-tap Google OAuth 2.0 single sign-on. |
| **Weather & Maps** | OpenWeather API & Leaflet.js | Live weather data, reverse geocoding, interactive map picker. |
| **Security & Rate Limit**| Express-Rate-Limit & CORS | API abuse prevention and secure cross-origin resource sharing. |

</div>

---

## 📁 Folder Structure

```
krishi-cure-ai/
├── controllers/               # Express request handlers & controller logic
├── data/                      # Crops, symptoms, and translation JSON databases
├── middlewares/               # Rate limiters & API validation middlewares
├── public/                    # Static frontend application directory
│   ├── css/                   # Design system & modular stylesheets
│   │   ├── chatbot.css        # Chatbot modal & message bubble styles
│   │   ├── illustrations.css  # Hero banner & illustration utility styles
│   │   ├── responsive.css     # Supplemental 320px to 4K responsive rules
│   │   └── style.css          # Primary design system, tokens, & global components
│   ├── images/                # Visual illustrations & app branding assets
│   │   ├── illustrations/     # Vector farming & diagnostic illustrations
│   │   └── logo.png           # Application logo
│   ├── js/                    # Client-side JavaScript modules
│   │   ├── app.js             # Global app init, router, & translation controller
│   │   ├── auth.js            # Firebase authentication helper
│   │   ├── chatbot.js         # Chatbot UI event handlers & session manager
│   │   ├── diagnostic.js      # Symptom submission & result DOM builder
│   │   ├── fertilizer-calc.js # Fertilizer dropdown & calculation engine
│   │   ├── status-ticker.js   # Live advisory ticker animation script
│   │   └── weather.js         # Weather API fetcher, Leaflet map, & advisory engine
│   ├── diagnosis-choice.html  # Diagnosis method selection page
│   ├── fertilizer-calculator.html # Smart fertilizer calculator page
│   ├── index.html             # Application home page & crop selection matrix
│   ├── login.html             # User authentication & landing feature overview
│   ├── result.html            # Scientific diagnosis dashboard page
│   ├── symptoms.html          # Manual symptom checklist selection page
│   ├── translations.js        # Multilingual dictionary store
│   └── upload.html            # Multimodal 4-slot image upload page
├── routes/                    # API route definitions
├── server/                    # Internal backend modular server architecture
│   ├── config/                # Environment variables & server constants
│   ├── controllers/           # API business logic implementations
│   ├── middlewares/           # Custom middleware handlers
│   ├── routes/                # Express router endpoints
│   └── utils/                 # Logger & error utility functions
├── .env.example               # Template for environment configuration
├── ARCHITECTURE.md            # Detailed application architecture documentation
├── package.json               # Node.js project manifest & dependencies
└── server.js                  # Main Node.js application entry point
```

---

## ⚡ Installation & Setup Guide

Follow these steps to run **Krishi Cure AI** locally on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/) (v8.0.0 or higher)
- A Google Gemini AI API key
- An OpenWeather API key

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/krishi-cure-ai.git
cd krishi-cure-ai
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the `.env.example` file to create your own `.env` file:
```bash
cp .env.example .env
```

Open `.env` and fill in your API credentials (see [Environment Variables](#-environment-variables) section below).

### Step 4: Run the Application
Start the development server with hot-reloading:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Google Gemini AI API Key
GEMINI_API_KEY=your_google_gemini_api_key_here

# OpenWeather API Key
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Firebase Configuration (for client auth)
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

> [!WARNING]
> Never commit your actual `.env` file or private API keys to public version control repositories.

---

## 📸 Screenshots

<div align="center">

| Home Page & Crop Selection | AI Disease Detection Upload |
| :---: | :---: |
| ![Home Page](https://via.placeholder.com/600x350.png?text=Krishi+Cure+AI+-+Home+Page) | ![Disease Detection](https://via.placeholder.com/600x350.png?text=Krishi+Cure+AI+-+Image+Upload) |

| Weather Advisory Module | Fertilizer Calculator |
| :---: | :---: |
| ![Weather Advisory](https://via.placeholder.com/600x350.png?text=Krishi+Cure+AI+-+Weather+Advisory) | ![Fertilizer Calculator](https://via.placeholder.com/600x350.png?text=Krishi+Cure+AI+-+Fertilizer+Calculator) |

| AI Agriculture Chatbot | Diagnosis Dashboard Result |
| :---: | :---: |
| ![AI Chatbot](https://via.placeholder.com/600x350.png?text=Krishi+Cure+AI+-+AI+Chatbot) | ![Diagnosis Result](https://via.placeholder.com/600x350.png?text=Krishi+Cure+AI+-+Diagnosis+Result) |

</div>

---

## 📱 Responsive Design & Compatibility

**Krishi Cure AI** features a responsive layout designed to function seamlessly across all screen sizes and modern web browsers:

- 📱 **Android Smartphones** (320px–480px, including small-width devices like iPhone SE)
- 📱 **Large Mobile Devices & Phablets** (481px–767px)
- 🍏 **iPads & Android Tablets** (Portrait & Landscape modes 768px–1023px)
- 💻 **MacBook Air & Small Laptops** (1024px–1366px)
- 💻 **MacBook Pro & Standard Laptops** (1366px–1600px)
- 🖥️ **Desktop Monitors & 2K/4K Ultra-Wide Displays** (1920px–2560px+)

### Cross-Browser Support
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Apple Safari
- Brave Browser

---

## ⚠️ Important Accuracy Note

> [!IMPORTANT]
> **AI Assistance Notice**:
> - All crop disease predictions generated by **Krishi Cure AI** are AI-assisted evaluations based on multimodal visual analysis of user-uploaded images and manually selected plant symptoms.
> - The **Confidence Score** indicates the statistical likelihood of the prediction based on agricultural datasets.
> - If the confidence score is low (<70%) or the disease symptoms appear severe and unrecoverable, users are strongly advised to consult a certified local agricultural extension officer, ICAR expert, or qualified agronomist before purchasing or applying intensive chemical treatments.
> - This application is an educational and advisory tool and does not claim 100% diagnostic accuracy under all environmental conditions.

---

## 🚀 Future Enhancements Roadmap

- 📈 **Real-Time APMC Mandi Prices**: Live market rates for regional crop yields across Indian states.
- 🧪 **Soil Health Card AI Analysis**: Upload soil test reports to extract nitrogen, phosphorus, potassium, and pH levels automatically.
- 🌾 **Crop Recommendation Engine**: Suggest optimal seasonal crops based on soil nutrient profiles and weather forecasts.
- 🔔 **Smart Push Notifications**: Automated weather warnings, spraying reminders, and irrigation alerts.
- 📊 **Farmer Activity Dashboard**: Historical diagnosis logs, fertilizer usage tracking, and harvest records.
- 📶 **Offline Support (PWA)**: Progress Web App functionality for accessing saved treatment guides in remote areas with low connectivity.
- 🏛️ **Government Scheme Integration**: Direct information portal for agricultural subsidies, insurance schemes (PMFBY), and farmer welfare policies.
- 🔮 **AI Yield Prediction**: Machine learning forecast models to estimate crop yield tonnage based on farm acreage and inputs.

---

## 🤝 Contribution Guidelines

Contributions, issues, and feature requests are welcome!

1. **Fork the Repository**
2. **Create a Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit Your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

Please ensure your code follows the established code style, includes appropriate inline comments, and tests responsiveness before opening a pull request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) — Multimodal AI analysis & conversation models.
- [OpenWeather API](https://openweathermap.org/) — Real-time weather data & forecasts.
- [Firebase Auth](https://firebase.google.com/) — Secure authentication infrastructure.
- [Leaflet.js](https://leafletjs.com/) & [OpenStreetMap](https://www.openstreetmap.org/) — Interactive mapping and location picker.
- [ICAR (Indian Council of Agricultural Research)](https://icar.org.in/) — Agriculture guidelines & references.

---

## 👩‍💻 Developer

<div align="center">

  ### **Bhatiya Kajal**
  *B.Tech in Computer Science Engineering (Artificial Intelligence)*  
  **Frontend Developer & AI Enthusiast**

  <p>Passionate about leveraging Artificial Intelligence, Modern Web Engineering, and Smart Agriculture solutions to solve real-world problems for farmers and rural communities.</p>

  <p>
    <a href="https://github.com/yourusername"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/></a>
    <a href="https://linkedin.com/in/yourusername"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>
    <a href="mailto:your.email@example.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/></a>
    <a href="https://yourportfolio.com"><img src="https://img.shields.io/badge/Portfolio-4CAF50?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio"/></a>
  </p>

</div>

---

## 🔗 Repository Link

- **GitHub Repository**: [https://github.com/yourusername/krishi-cure-ai](https://github.com/yourusername/krishi-cure-ai)
