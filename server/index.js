import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env from project root or fallback to server/.env
try {
  const rootEnv = path.resolve(process.cwd(), '.env');
  const serverEnv = path.resolve(process.cwd(), 'server', '.env');
  if (fs.existsSync(rootEnv)) {
    dotenv.config({ path: rootEnv });
    console.log('Loaded .env from project root');
  } else if (fs.existsSync(serverEnv)) {
    dotenv.config({ path: serverEnv });
    console.log('Loaded .env from server/.env');
  } else {
    dotenv.config();
    console.warn('No .env file found at root or server/.env');
  }
} catch (e) {
  dotenv.config();
}

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';

import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import dashboardRoutes from './routes/dashboard.js';
import interviewRoutes from './routes/interview.js';
import profileRoutes from './routes/profile.js';
import badgeRoutes from './routes/badges.js';
// existing route imports below

// Debug environment variables
console.log('Environment variables loaded:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'NOT FOUND');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI present:', (!!process.env.MONGO_URI || !!process.env.mongo_URI || !!process.env.MONGODB_URI) ? 'YES' : 'NO');

// Validate environment variables
const requiredEnvVars = ['GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('The application will run in demo mode. Add these variables to your .env file for full functionality.');
} else {
  console.log(' All environment variables loaded successfully!');
}

// Import routes after environment variables are loaded
import skillGapRoutes from './routes/skillGap.js';
import careerRoutes from './routes/career.js';
import chatRoutes from './routes/chat.js';
import projectRoutes from './routes/projects.js';
import jobRoutes from './routes/jobs.js';
import collegeRoutes from './routes/colleges.js';
import enhancedDashboardRoutes from './routes/enhanced_dashboard.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// MongoDB connection (supports multiple env var names)
let mongoUri = process.env.MONGO_URI || process.env.mongo_URI || process.env.MONGODB_URI;
if (!mongoUri) {
  console.warn('Warning: MONGO_URI not found in environment. MongoDB features will be disabled.');
} else {
  // Trim accidental wrapping quotes
  mongoUri = mongoUri.replace(/^['"]|['"]$/g, '');
  try {
    const shown = mongoUri.replace(/(:)([^@]+)(@)/, (_, a, b, c) => a + '***' + c);
    console.log('Attempting MongoDB connect to URI:', shown);
  } catch (_) {}
  mongoose
    .connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME || undefined,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
    });
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/enhanced-dashboard', enhancedDashboardRoutes); // New enhanced dashboard
app.use('/api/interview', interviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/colleges', collegeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const isApiConfigured = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'demo-key';
  const dbState = mongoose.connection?.readyState;
  const dbConnected = dbState === 1;
  res.json({ 
    message: 'AI Career Advisor API is running!',
    status: 'healthy',
    aiConfigured: isApiConfigured,
    environment: process.env.NODE_ENV || 'development',
    dbConnected,
    dbState
  });
});

// Debug: list registered routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((m) => {
    if (m.route && m.route.path) {
      const methods = Object.keys(m.route.methods).join(',').toUpperCase();
      routes.push({ path: m.route.path, methods });
    } else if (m.name === 'router' && m.handle.stack) {
      m.handle.stack.forEach((h) => {
        if (h.route && h.route.path) {
          const base = m.regexp && m.regexp.source ? m.regexp.source : '';
          const basePath = base.replace('^\\/','/').split('\\/?')[0].replace('^','');
          const methods = Object.keys(h.route.methods).join(',').toUpperCase();
          routes.push({ path: `${basePath}${h.route.path}`.replace(/\\/g,''), methods });
        }
      });
    }
  });
  res.json({ routes });
});

// 404 handler to surface missing routes
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found', path: req.url });
});

// Test AI endpoint
app.get('/api/test-ai', async (req, res) => {
  try {
    const { generateResponse } = await import('./config/gemini.js');
    const result = await generateResponse('Say "AI is working!" if you can respond.');
    res.json({
      success: true,
      message: 'AI test completed',
      result: result
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'AI test failed',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});