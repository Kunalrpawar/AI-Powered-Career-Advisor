import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../schema/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Ping
router.get('/ping', (req, res) => {
  res.json({ ok: true, route: '/api/auth', message: 'auth route mounted' });
});

// Register
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, age, gender, classStd, academicInterests, avatar, dreams } = req.body;
    console.log('Registration request received:', { name, email, gender, classStd, avatar, dreams, academicInterests });
    
    if (typeof email === 'string') email = email.trim().toLowerCase();
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (mongoose.connection.readyState !== 1) {
      console.log('Database connection state:', mongoose.connection.readyState);
      return res.status(503).json({ error: 'Database not connected' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Email already exists:', email);
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    
    // Build user data object with additional fields
    const userData = { 
      name, 
      email, 
      passwordHash: hash,
      ...(age && { age: parseInt(age) }),
      ...(gender && { gender }),
      ...(classStd && { classStd }),
      ...(academicInterests && { academicInterests })
    };
    
    // Store additional fields in a metadata object
    if (avatar || dreams) {
      userData.metadata = {
        ...(avatar && { avatar }),
        ...(dreams && { dreams })
      };
    }
    
    console.log('Creating user with data:', userData);
    const user = await User.create(userData);
    console.log('User created successfully:', user._id);
    
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
    console.error('Register error:', err);
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed: ' + (err.message || 'Unknown error') });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log('Login attempt for email:', email);
    if (typeof email === 'string') email = email.trim().toLowerCase();
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected');
      return res.status(503).json({ error: 'Database not connected' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('User found:', user.email);
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log('Password comparison failed');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('Login successful for:', email);
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
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).lean();
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
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
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;


