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
    let { name, email, password, age, gender, classStd, academicInterests } = req.body;
    if (typeof email === 'string') email = email.trim().toLowerCase();
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const userData = { 
      name, 
      email, 
      passwordHash: hash,
      ...(age && { age: parseInt(age) }),
      ...(gender && { gender }),
      ...(classStd && { classStd }),
      ...(academicInterests && { academicInterests })
    };
    const user = await User.create(userData);
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
        completedTasks: user.completedTasks || []
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (typeof email === 'string') email = email.trim().toLowerCase();
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
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
        completedTasks: user.completedTasks || []
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
      completedTasks: user.completedTasks || []
    });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;


