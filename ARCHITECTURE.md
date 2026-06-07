# Krishi Cure AI - Architecture Documentation

## System Overview

Krishi Cure AI follows a professional three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                         │
│          Frontend (HTML/CSS/JavaScript)                      │
│  - User Interface                                            │
│  - Form handling                                             │
│  - API Service Layer                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                        │
│              Backend Services & Controllers                  │
│  - AI Service          (Diagnosis & Chatbot)                 │
│  - Data Service        (Crops & Master Data)                 │
│  - Fertilizer Service  (Calculations)                        │
│  - Error Handling      (Unified responses)                   │
│  - Input Validation    (Request validation)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   PERSISTENCE LAYER                          │
│              Data & External Services                        │
│  - Crops Database      (crops.json)                          │
│  - AI APIs             (Groq, Gemini)                        │
│  - Firebase Auth       (User authentication)                 │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Backend Structure (`server/`)

```
server/
├── config/
│   ├── constants.js          ← Application constants (ports, timeouts, etc.)
│   └── environment.js         ← Environment variables & validation
│
├── controllers/               ← Request handlers
│   ├── dataController.js     ← Master data endpoint
│   ├── diagnosisController.js ← Disease diagnosis logic
│   ├── chatbotController.js  ← Chatbot endpoint
│   └── fertilizerController.js ← Fertilizer calculation
│
├── services/                  ← Business logic layer
│   ├── aiService.js          ← AI model integration (Groq/Gemini)
│   ├── dataService.js        ← Data loading & caching
│   └── fertilizerService.js  ← Fertilizer calculations
│
├── validators/                ← Input validation
│   └── inputValidator.js     ← Request body validation rules
│
├── utils/                     ← Utility functions
│   ├── errorHandler.js       ← Error handling & responses
│   ├── middleware.js         ← CORS & logging middleware
│   └── validationMiddleware.js ← Express middleware validators
│
├── middlewares/
│   └── rateLimiter.js        ← API rate limiting
│
└── routes/
    └── api.js                 ← API endpoint definitions
```

### Frontend Structure (`src/`)

```
src/
├── services/
│   └── apiService.js         ← Centralized API client
│
├── utils/
│   └── helpers.js            ← Helper functions & utilities
│
└── constants/
    └── uiConstants.js        ← UI & app constants

public/                        ← Static files served to browser
├── index.html
├── login.html
├── diagnosis-choice.html
├── symptoms.html
├── upload.html
├── result.html
├── fertilizer-calculator.html
├── js/                       ← Frontend scripts
└── css/                      ← Stylesheets
```

## Data Flow

### 1. Diagnosis by Symptoms

```
User Interface
     ↓
API Service (apiService.js)
     ↓
Express Route (/api/diagnose)
     ↓
Middleware (Validation, CORS)
     ↓
Controller (diagnosisController)
     ↓
Services (DataService, AIService)
     ↓
External APIs (Groq/Gemini)
     ↓
Response → Browser
```

### 2. Request Flow Details

```javascript
// Frontend
const result = await ApiService.diagnoseBySymptomsAsync({
  cropId: 'wheat',
  symptoms: ['symptom1'],
  lang: 'en'
});

// Backend Route
router.post('/diagnose', validateDiagnosis, diagnoseBySymptomsController);

// Controller
async function diagnoseBySymptomsController(req, res) {
  // 1. Get crop name from data service
  const cropName = await dataService.getCropName(cropId);
  
  // 2. Convert symptom IDs to names
  const symptomNames = await dataService.convertSymptomIds(symptoms);
  
  // 3. Call AI service for diagnosis
  const result = await aiService.generateDiagnosis({
    cropName,
    symptoms: symptomNames,
    lang
  });
  
  // 4. Send response
  res.json(createSuccessResponse(result));
}
```

## Key Components

### AIService (`server/services/aiService.js`)

**Responsibilities:**
- Integrate with Groq and Gemini APIs
- Handle AI model fallback logic
- Format prompts for consistency
- Parse JSON responses
- Cache results for performance

**Key Methods:**
- `generateDiagnosis(input)` - AI-powered disease diagnosis
- `generateChatResponse(question, lang, history)` - Chatbot responses
- `classifyConfidence(score)` - Confidence level classification

### DataService (`server/services/dataService.js`)

**Responsibilities:**
- Load crops database
- Cache master data in memory
- Provide data access methods
- Manage data lifecycle

**Key Methods:**
- `getCropsData()` - Get all crops & symptoms
- `getCropName(cropId, lang)` - Get crop name in language
- `convertSymptomIds(ids, lang)` - Convert IDs to names

### FertilizerService (`server/services/fertilizerService.js`)

**Responsibilities:**
- Calculate fertilizer requirements
- Convert area units
- Provide localized content
- Format calculation results

**Key Methods:**
- `calculateFertilizerRequirements(input)` - Main calculation
- `convertAreaToHectares(area, unit)` - Area conversion

## API Design

### Request/Response Pattern

**Request:**
```javascript
{
  "cropId": "wheat",
  "symptoms": ["symptom1", "symptom2"],
  "lang": "en"
}
```

**Success Response:**
```javascript
{
  "success": true,
  "data": { /* result data */ },
  "message": "Optional success message",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Error Response:**
```javascript
{
  "success": false,
  "error": "Descriptive error message",
  "statusCode": 400,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Configuration Management

### Environment Variables (`server/config/environment.js`)

```javascript
ENV = {
  PORT: 3000,
  NODE_ENV: 'development',
  GROQ_API_KEY: '...',
  GEMINI_API_KEY: '...',
  FIREBASE_*: '...'
}
```

### Application Constants (`server/config/constants.js`)

```javascript
CONFIG = {
  SERVER: { PORT, ENVIRONMENT, CORS_ORIGIN },
  RATE_LIMIT: { WINDOW_MS, MAX_REQUESTS },
  CACHE: { TTL_DIAGNOSIS, TTL_DATA },
  TIMEOUT: { FETCH_DEFAULT, AI_SERVICE },
  LANGUAGES: { EN, HI, GU, DEFAULT },
  AI_MODELS: { GROQ, GEMINI }
}
```

## Error Handling Strategy

### Validation Layer
```javascript
// Input validation in validators/
validateDiagnosisInput(data) → { isValid, error }
```

### Middleware Layer
```javascript
// Express middleware in utils/validationMiddleware.js
validateDiagnosis → next() or 400 error
```

### Service Layer
```javascript
// Try-catch in services
try {
  await aiService.generateDiagnosis();
} catch (error) {
  console.error('Error:', error);
  throw new Error('Service unavailable');
}
```

### Response Layer
```javascript
// Global error handler in utils/errorHandler.js
globalErrorHandler → 500 response
```

## Caching Strategy

### DataService Cache
- Crops data cached in memory
- TTL: 1 hour
- Auto-reload on expire
- Manual clear available

### AI Results Cache
- Diagnosis results cached
- TTL: 1 hour
- Key: `${cropName}_${symptoms}_${lang}`

## Security Measures

1. **Input Validation**
   - All requests validated before processing
   - Sanitization of string inputs

2. **Rate Limiting**
   - Express rate-limiter middleware
   - 60 requests per minute per IP

3. **CORS**
   - Configurable via environment
   - Strict headers enforcement

4. **Environment Variables**
   - API keys never in source code
   - Validated on startup

5. **Error Handling**
   - No sensitive data in error responses
   - Consistent error messaging

## Performance Optimizations

1. **Caching**
   - Master data cached in memory
   - Diagnosis results cached

2. **Async Operations**
   - Non-blocking I/O
   - Promise-based architecture

3. **Request Sizing**
   - Limited payload size (50MB)
   - Efficient JSON parsing

4. **API Fallback**
   - Groq primary, Gemini fallback
   - Graceful degradation

## Testing Strategy

### Unit Tests (Future)
- Service functions
- Utility functions
- Validators

### Integration Tests (Future)
- API endpoints
- Database operations
- External API calls

### End-to-End Tests (Future)
- User workflows
- Error scenarios
- Different languages

## Deployment Architecture

```
┌────────────┐
│  Vercel    │
│  (Hosting) │
└─────┬──────┘
      │
      ├── Node.js Server
      ├── Environment Variables
      ├── Static Files
      └── API Routes
```

## Future Improvements

1. **Database**
   - Move from JSON to database
   - Better data consistency

2. **Caching**
   - Redis for distributed caching
   - Improved performance

3. **Logging**
   - Structured logging
   - Log aggregation

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring

5. **Testing**
   - Comprehensive test coverage
   - Automated testing pipeline

---

**Document Version:** 1.0
**Last Updated:** 2024
