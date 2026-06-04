import express from 'express';
import path from 'path';
import limiter from './middlewares/rateLimiter.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use((req, res, next) => {
    const contentLength = req.headers['content-length'];
    if (contentLength) {
        const kb = (parseInt(contentLength, 10) / 1024).toFixed(2);
        console.warn(`[Request Size Log] ${req.method} ${req.url} - Size: ${kb} KB`);
    }
    next();
});

app.use(limiter);

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Fallback route for SPA if needed
app.use((req, res, next) => {
    // only fallback if it's not an API request
    if (req.url.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("[Global Error Handler] Caught unhandled exception:", err);
    res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Server is running on http://localhost:${PORT}`);
});
