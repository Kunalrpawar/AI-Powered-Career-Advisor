import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from project root
try {
  dotenv.config({ path: path.join(__dirname, '..', '.env') });
  console.log('📄 Loaded .env from project root');
} catch (e) {
  console.log('⚠️ Could not load .env file:', e.message);
}

// Define User schema directly to avoid import issues
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
    classStd: { type: String, default: '12' },
    academicInterests: [{ type: String }],
    badges: [{ 
      id: String,
      name: String,
      description: String,
      earnedAt: { type: Date, default: Date.now },
      category: { type: String, enum: ['aptitude', 'skill', 'career', 'project', 'interview'] }
    }],
    completedTasks: [{ 
      taskId: String,
      taskName: String,
      completedAt: { type: Date, default: Date.now }
    }],
    metadata: {
      avatar: { type: String },
      dreams: { type: String }
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'hackgen-super-secret-jwt-key-2024';

// Debug environment
console.log('=== Vercel Function Debug ===');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ SET' : '❌ NOT SET');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ SET' : '❌ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ USING DEFAULT');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('=============================');

// Middleware
app.use(cors({
  origin: ['https://career-manzil.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB connection with better error handling
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ Already connected to MongoDB');
    return;
  }
  
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MongoDB URI not found in environment variables');
      throw new Error('MongoDB URI not configured');
    }
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

// Authentication routes - defined directly to avoid import issues

// Root API route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hackgen API is working!',
    timestamp: new Date().toISOString(),
    env: {
      mongoConfigured: !!process.env.MONGO_URI,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      jwtConfigured: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    },
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /test', 
      'GET /auth/ping',
      'POST /auth/login',
      'POST /auth/register',
      'GET /auth/me'
    ]
  });
});

// Auth ping
app.get('/auth/ping', (req, res) => {
  res.json({ 
    ok: true, 
    route: '/api/auth', 
    message: 'auth route working',
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1
  });
});

// Register endpoint
app.post('/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', { email: req.body.email, name: req.body.name });
    
    let { name, email, password, age, gender, classStd, academicInterests, avatar, dreams } = req.body;
    
    if (typeof email === 'string') email = email.trim().toLowerCase();
    if (!name || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected');
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('❌ Email already exists:', email);
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');
    
    const userData = { 
      name, 
      email, 
      passwordHash: hash,
      ...(age && { age: parseInt(age) }),
      ...(gender && { gender }),
      ...(classStd && { classStd }),
      ...(academicInterests && { academicInterests })
    };
    
    if (avatar || dreams) {
      userData.metadata = {
        ...(avatar && { avatar }),
        ...(dreams && { dreams })
      };
    }
    
    const user = await User.create(userData);
    console.log('✅ User created successfully:', user._id);
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        age: user.age,
        gender: user.gender,
        classStd: user.classStd,
        academicInterests: user.academicInterests,
        badges: user.badges || [],
        completedTasks: user.completedTasks || [],
        metadata: user.metadata || {}
      }
    });
    
  } catch (err) {
    console.error('❌ Register error:', err);
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log('🔑 Login attempt for email:', email);
    
    if (typeof email === 'string') email = email.trim().toLowerCase();
    
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected');
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ User found:', user.email);
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log('❌ Password comparison failed');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Login successful for:', email);
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        age: user.age,
        gender: user.gender,
        classStd: user.classStd,
        academicInterests: user.academicInterests,
        badges: user.badges || [],
        completedTasks: user.completedTasks || [],
        metadata: user.metadata || {}
      } 
    });
    
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Me endpoint
app.get('/auth/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).lean();
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({ 
      id: user._id, 
      name: user.name, 
      email: user.email,
      age: user.age,
      gender: user.gender,
      classStd: user.classStd,
      academicInterests: user.academicInterests,
      badges: user.badges || [],
      completedTasks: user.completedTasks || [],
      metadata: user.metadata || {}
    });
    
  } catch (err) {
    console.error('❌ Auth/me error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: isConnected,
    env: process.env.NODE_ENV,
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Vercel API working!', 
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// 404 handler
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'API endpoint not found', 
    path: req.url,
    method: req.method,
    availableRoutes: [
      '/auth/login', '/auth/register', '/auth/me',
      '/dashboard', '/chat', '/profile', '/projects',
      '/jobs', '/career', '/skill-gap', '/colleges',
      '/health', '/test'
    ]
  });
});

// Export for Vercel
export default async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://career-manzil.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Log the request
    console.log(`[VERCEL] ${req.method} ${req.url}`);
    
    // Handle the request
    return app(req, res);
    
  } catch (error) {
    console.error('❌ Vercel function error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};