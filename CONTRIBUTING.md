# Contributing to Krishi Cure AI

Thank you for considering contributing to Krishi Cure AI! We welcome contributions from the community.

## 🎯 How to Contribute

### Reporting Bugs

When reporting bugs, please include:
- Clear, descriptive title
- Detailed description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- Your environment (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions should include:
- Clear, descriptive title
- Detailed description of proposed enhancement
- Motivation and use cases
- Possible implementation approach
- Additional context or examples

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/krishi-cure-ai.git
   cd krishi-cure-ai
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Keep functions small and focused
   - Validate inputs properly

4. **Test your changes**
   ```bash
   npm start
   # Test the application locally
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add brief description of changes"
   # Use clear, descriptive commit messages
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure tests pass

## 📋 Code Standards

### JavaScript

```javascript
// Use meaningful names
const cropDiseaseAnalysis = analyzeCropDisease(cropId, symptoms);

// Add JSDoc comments for functions
/**
 * Analyzes crop disease based on symptoms
 * @param {string} cropId - The crop identifier
 * @param {Array<string>} symptoms - Array of symptom IDs
 * @returns {Promise<Object>} - Disease analysis result
 */
export async function analyzeCropDisease(cropId, symptoms) {
  // Implementation
}

// Handle errors properly
try {
  const result = await aiService.generateDiagnosis(data);
  return result;
} catch (error) {
  console.error('Error:', error);
  throw new Error('Failed to generate diagnosis');
}
```

### Folder Organization

- Backend code in `server/`
- Frontend code in `public/` or `src/`
- Services in respective `services/` folders
- Utilities in `utils/`
- Constants in `constants/` or `config/`

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Functions | camelCase | `calculateFertilizer()` |
| Variables | camelCase | `cropName` |
| Classes | PascalCase | `DataService` |
| Constants | UPPER_SNAKE_CASE | `MAX_IMAGES` |
| Files | kebab-case | `api-service.js` |

### Error Handling

- Always validate input
- Provide meaningful error messages
- Use try-catch for async operations
- Log errors for debugging

```javascript
// Good error handling
export function validateInput(data) {
  if (!data.cropId) {
    return { isValid: false, error: 'cropId is required' };
  }
  return { isValid: true };
}
```

## 🎨 UI/UX Guidelines

- **Don't change existing UI design** unless addressing a specific issue
- **Maintain responsive design** - test on mobile, tablet, desktop
- **Use consistent styling** - follow existing CSS patterns
- **Add accessibility features** - ARIA labels, semantic HTML
- **Test with different languages** - ensure translations work properly

## 🧪 Testing

Before submitting a PR:

1. Test on localhost
2. Test with different browsers
3. Test with different languages
4. Test error scenarios
5. Check console for errors/warnings

## 📝 Commit Messages

Use clear, descriptive commit messages:

```
Good:
- feat: Add disease confidence levels
- fix: Resolve CORS origin error
- docs: Update API documentation
- refactor: Simplify fertilizer calculation

Avoid:
- fixed bugs
- changes
- updates
```

## 📚 Documentation

When adding features, update documentation:

- Update README if changing setup
- Add API docs for new endpoints
- Comment complex logic
- Update ARCHITECTURE.md if changing structure

## 🔄 Pull Request Process

1. Update README with any new information
2. Ensure all tests pass
3. Maintain consistent code style
4. Provide clear PR description
5. Reference related issues

## ✅ Review Process

- At least one approval required
- Maintainer will review code
- May request changes
- Once approved, ready to merge

## 📞 Questions?

- Open a discussion in GitHub
- Check existing issues
- Email: support@krishicure.com

## 🙏 Thank You

Your contributions make Krishi Cure AI better! We appreciate your effort to improve this project.

---

**Contributing Guidelines Version:** 1.0
**Last Updated:** 2024
