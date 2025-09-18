import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function prepareDist() {
  console.log('🚀 Preparing production build...');
  
  try {
    // Ensure dist directory exists
    const distDir = path.join(projectRoot, 'dist');
    await fs.ensureDir(distDir);
    
    // Copy server files to dist
    console.log('📁 Copying server files...');
    await fs.copy(path.join(projectRoot, 'server'), path.join(distDir, 'server'));
    
    // Copy package.json (production version)
    console.log('📦 Creating production package.json...');
    const packageJson = await fs.readJson(path.join(projectRoot, 'package.json'));
    
    // Create production package.json with only runtime dependencies
    const prodPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      type: packageJson.type,
      scripts: {
        start: "node server.js"
      },
      dependencies: {
        // Only include runtime dependencies (exclude dev tools)
        "@google/generative-ai": packageJson.dependencies["@google/generative-ai"],
        "bcryptjs": packageJson.dependencies["bcryptjs"],
        "cors": packageJson.dependencies["cors"],
        "dotenv": packageJson.dependencies["dotenv"],
        "express": packageJson.dependencies["express"],
        "jsonwebtoken": packageJson.dependencies["jsonwebtoken"],
        "mongoose": packageJson.dependencies["mongoose"],
        "multer": packageJson.dependencies["multer"]
      }
    };
    
    await fs.writeJson(path.join(distDir, 'package.json'), prodPackageJson, { spaces: 2 });
    
    // Create production server.js that serves static files
    console.log('🖥️ Creating production server...');
    const prodServerContent = `import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';

// Import all your existing routes
import authRoutes from './server/routes/auth.js';
import documentRoutes from './server/routes/documents.js';
import dashboardRoutes from './server/routes/dashboard.js';
import interviewRoutes from './server/routes/interview.js';
import profileRoutes from './server/routes/profile.js';
import badgeRoutes from './server/routes/badges.js';
import skillGapRoutes from './server/routes/skillGap.js';
import careerRoutes from './server/routes/career.js';
import chatRoutes from './server/routes/chat.js';
import projectRoutes from './server/routes/projects.js';
import jobRoutes from './server/routes/jobs.js';
import collegeRoutes from './server/routes/colleges.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from built frontend
const staticPath = path.join(__dirname, 'client');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// MongoDB connection
let mongoUri = process.env.MONGO_URI || process.env.mongo_URI || process.env.MONGODB_URI;
if (mongoUri) {
  mongoUri = mongoUri.replace(/^['"]|['"]$/g, '');
  mongoose
    .connect(mongoUri, {
      dbName: process.env.MONGO_DB_NAME || undefined,
    })
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
    });
} else {
  console.warn('⚠️ MONGO_URI not found. Database features disabled.');
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/dashboard', dashboardRoutes);
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
    environment: process.env.NODE_ENV || 'production',
    dbConnected,
    dbState
  });
});

// Serve React app for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Production server running on port \${PORT}\`);
  console.log(\`📱 Frontend: http://localhost:\${PORT}\`);
  console.log(\`🔌 API: http://localhost:\${PORT}/api\`);
});
`;
    
    await fs.writeFile(path.join(distDir, 'server.js'), prodServerContent);
    
    // Copy built frontend to dist/client
    const buildDir = path.join(projectRoot, 'dist');
    const clientDir = path.join(distDir, 'client');
    
    if (await fs.pathExists(buildDir)) {
      console.log('📱 Copying built frontend...');
      // Copy built frontend files
      await fs.copy(buildDir, clientDir, {
        filter: (src) => !src.endsWith('server.js') && !src.includes('server') && !src.includes('package.json')
      });
    }
    
    // Copy locales for i18n
    if (await fs.pathExists(path.join(projectRoot, 'locales'))) {
      console.log('🌐 Copying locales...');
      await fs.copy(path.join(projectRoot, 'locales'), path.join(clientDir, 'locales'));
    }
    
    console.log('✅ Production build ready in ./dist/');
    console.log('');
    console.log('🚀 To run the production build:');
    console.log('   cd dist');
    console.log('   npm install');
    console.log('   npm start');
    console.log('');
    console.log('📁 Deploy the ./dist/ folder to any hosting service!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

prepareDist();