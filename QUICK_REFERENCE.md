# Quick Reference Guide - Krishi Cure AI Refactored

## 🚀 Quick Start

```bash
# Setup
cp .env.example .env        # Create .env and add API keys
npm install                  # Install dependencies

# Running
npm start                    # Start server (port 3000)
npm run dev                  # Development with auto-reload

# Testing
curl http://localhost:3000/api/data  # Test server
```

## 📂 Finding Code

| Feature | Location |
|---------|----------|
| Disease Diagnosis | `server/services/aiService.js` |
| Crop Data | `server/services/dataService.js` |
| Fertilizer Calc | `server/services/fertilizerService.js` |
| API Routes | `server/routes/api.js` |
| Input Validation | `server/validators/inputValidator.js` |
| Error Handling | `server/utils/errorHandler.js` |
| Frontend API | `src/services/apiService.js` |
| UI Constants | `src/constants/uiConstants.js` |
| Helpers | `src/utils/helpers.js` |

## 🔑 Key Features

### Configuration
- Environment variables in `.env`
- Constants centralized in `server/config/constants.js`
- Validation on startup via `validateEnvironment()`

### Error Handling
```javascript
// All errors follow this format
{
  "success": false,
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Input Validation
- All requests validated in middleware
- Sanitization of user inputs
- Clear error messages

### Rate Limiting
- 60 requests per minute per IP
- Protects API from abuse

## 📡 API Endpoints

```
GET  /api/data                    # Get master data
GET  /api/firebase-config         # Get Firebase config
POST /api/diagnose                # Diagnose by symptoms
POST /api/diagnose-image          # Diagnose by image
POST /api/chatbot                 # Ask agriculture question
POST /api/fertilizer/calculate    # Calculate fertilizer
```

## 🔧 Adding New Feature

1. **Create Service** in `server/services/`
   ```javascript
   export class MyService {
     async doSomething(data) { /* implementation */ }
   }
   ```

2. **Create Controller** in `server/controllers/`
   ```javascript
   export async function myController(req, res) {
     const result = await myService.doSomething(req.body);
     res.json(createSuccessResponse(result));
   }
   ```

3. **Create Validator** in `server/validators/`
   ```javascript
   export function validateMyInput(data) {
     if (!data.required) return { isValid: false, error: 'message' };
     return { isValid: true };
   }
   ```

4. **Add Middleware** in `server/utils/validationMiddleware.js`
   ```javascript
   export function validateMyEndpoint(req, res, next) {
     const validation = validateMyInput(req.body);
     if (!validation.isValid) {
       return res.status(400).json(createErrorResponse(validation.error, 400));
     }
     next();
   }
   ```

5. **Add Route** in `server/routes/api.js`
   ```javascript
   router.post('/my-endpoint', validateMyEndpoint, myController);
   ```

## 📚 Important Files

### Configuration
- `server/config/constants.js` - All app constants
- `server/config/environment.js` - Environment variables
- `.env` - Your local configuration (never commit)

### Services
- `server/services/aiService.js` - AI model integration
- `server/services/dataService.js` - Crops data management
- `server/services/fertilizerService.js` - Fertilizer calculations

### Controllers
- `server/controllers/dataController.js` - Master data
- `server/controllers/diagnosisController.js` - Disease diagnosis
- `server/controllers/chatbotController.js` - Agriculture chatbot
- `server/controllers/fertilizerController.js` - Fertilizer calculations

### Middleware & Utils
- `server/middlewares/rateLimiter.js` - Rate limiting
- `server/utils/errorHandler.js` - Error responses
- `server/utils/middleware.js` - CORS & logging
- `server/utils/validationMiddleware.js` - Request validation

## 🔐 Security

- API keys in environment variables only
- CORS properly configured
- Rate limiting enabled
- Input validation on all endpoints
- Error messages don't expose internals

## 📝 Code Style

```javascript
// Use meaningful names
const cropDiseaseAnalysis = await aiService.generateDiagnosis(data);

// Add JSDoc comments
/**
 * @param {string} cropId - Crop identifier
 * @returns {Promise<Object>} - Diagnosis result
 */

// Proper error handling
try {
  const result = await service.method();
} catch (error) {
  console.error('Context:', error);
  throw new Error('User-friendly message');
}
```

## 🧪 Testing Locally

```bash
# Test diagnosis endpoint
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"cropId":"wheat","symptoms":["symptom1"],"lang":"en"}'

# Test chatbot
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"question":"How to grow wheat?","lang":"en"}'

# Test fertilizer calculation
curl -X POST http://localhost:3000/api/fertilizer/calculate \
  -H "Content-Type: application/json" \
  -d '{"cropId":"wheat","fertilizerId":"urea","areaUnit":"Acre","areaValue":5,"lang":"en"}'
```

## 📚 Documentation

- **README.md** - Project overview & setup
- **ARCHITECTURE.md** - System design & data flow
- **CONTRIBUTING.md** - How to contribute
- **DEPLOYMENT.md** - Deployment guide
- **This file** - Quick reference

## 💡 Common Tasks

### Check if server is running
```bash
curl http://localhost:3000/api/data
```

### View environment validation
- Check console output on server start
- Look for "✅ Environment configuration valid"

### Clear data cache
```javascript
// In code
dataService.clearCache();
aiService.clearCache();
```

### Add new language
1. Add language code to `CONFIG.LANGUAGES` in `server/config/constants.js`
2. Add translations to `crops.json` in `data/` folder
3. Update constants in `src/constants/uiConstants.js`

## 🚀 Performance Tips

1. Environment variables are loaded once at startup
2. Master data is cached in memory
3. AI responses are cached by default
4. Rate limiting prevents abuse

## 🐛 Debugging

- Check `.env` file exists and has valid keys
- Check server logs for "✅" or "❌" messages
- Use browser DevTools to inspect API calls
- Check `server/config/environment.js` for validation

## 📞 Need Help?

1. Check README.md
2. Check ARCHITECTURE.md
3. Check CONTRIBUTING.md
4. Check code comments (JSDoc)
5. Open an issue on GitHub

---

**Version:** 1.0  
**Last Updated:** 2024
