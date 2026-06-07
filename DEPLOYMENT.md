# Deployment Guide - Krishi Cure AI

## Deploying to Vercel (Recommended)

### Prerequisites
- Vercel account
- GitHub account with repository
- Environment variables prepared

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository and click "Import"

### Step 2: Configure Environment Variables

In the Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add all variables from your `.env` file:
   - `PORT` (optional, Vercel sets this)
   - `NODE_ENV=production`
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY`
   - `FIREBASE_*` (all Firebase config)
   - `CORS_ORIGIN` (set to your domain)

### Step 3: Configure Build Settings

1. Framework: **Other** (or leave blank)
2. Build Command: (leave blank - no build needed)
3. Output Directory: (leave blank)
4. Install Command: `npm install`
5. Start Command: `node server.js`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at `https://your-project.vercel.app`

## Other Deployment Options

### Heroku

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set GROQ_API_KEY=your_key
heroku config:set GEMINI_API_KEY=your_key
# ... set other variables

# Deploy
git push heroku main
```

### AWS EC2

1. Launch EC2 instance (Node.js AMI)
2. SSH into instance
3. Clone repository
4. Install dependencies: `npm install`
5. Set environment variables
6. Start server: `npm start`
7. Configure security groups for port 3000

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t krishi-cure-ai .
docker run -p 3000:3000 -e GROQ_API_KEY=your_key krishi-cure-ai
```

## Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `PORT` configured
- [ ] `NODE_ENV=production`
- [ ] `GROQ_API_KEY` or `GEMINI_API_KEY`
- [ ] All `FIREBASE_*` variables
- [ ] `CORS_ORIGIN` set correctly

## Post-Deployment

### Health Check
```bash
curl https://your-domain/api/data
```

### Monitor Logs
- Vercel: Dashboard → Deployments → Logs
- Heroku: `heroku logs --tail`

### Domain Configuration

For custom domain:
1. Update DNS records
2. Configure domain in hosting platform
3. Update `CORS_ORIGIN` in environment

## Troubleshooting Deployment

### 502 Bad Gateway
- Check if server is running
- Verify environment variables
- Check logs for errors

### CORS Errors
- Update `CORS_ORIGIN` to match your domain
- Redeploy after changes

### API Key Issues
- Verify keys are set correctly
- Check API key limits
- Regenerate keys if needed

## Rollback

### Vercel
1. Go to "Deployments"
2. Select previous deployment
3. Click "..." → "Promote to Production"

### Heroku
```bash
heroku rollback v10  # Replace with previous version
```

## Performance Tips

1. Enable caching headers
2. Use CDN for static files
3. Monitor API response times
4. Set up alerts for errors

## Security Checklist

- [ ] Environment variables not in source code
- [ ] `.env` in `.gitignore`
- [ ] Use HTTPS only
- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities
- [ ] Implement rate limiting
- [ ] Validate all inputs

## Support

For deployment issues:
- Check logs in hosting platform
- Review environment variables
- Verify API keys are valid
- Contact hosting provider support
