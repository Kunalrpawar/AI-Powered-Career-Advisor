import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../schema/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Update profile
router.put('/update', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const payload = jwt.verify(token, JWT_SECRET);
    const { age, gender, classStd, academicInterests } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const updateData = {};
    if (age !== undefined) updateData.age = parseInt(age);
    if (gender !== undefined) updateData.gender = gender;
    if (classStd !== undefined) updateData.classStd = classStd;
    if (academicInterests !== undefined) updateData.academicInterests = academicInterests;
    
    const user = await User.findByIdAndUpdate(
      payload.userId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
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
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Award badge
router.post('/award-badge', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const payload = jwt.verify(token, JWT_SECRET);
    const { badgeId, badgeName, description, category } = req.body;
    
    if (!badgeId || !badgeName || !category) {
      return res.status(400).json({ error: 'Badge ID, name, and category are required' });
    }
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const user = await User.findById(payload.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Check if badge already exists
    const existingBadge = user.badges?.find(badge => badge.id === badgeId);
    if (existingBadge) {
      return res.status(409).json({ error: 'Badge already earned' });
    }
    
    const newBadge = {
      id: badgeId,
      name: badgeName,
      description: description || `Earned for completing ${category} tasks`,
      category,
      earnedAt: new Date()
    };
    
    user.badges = user.badges || [];
    user.badges.push(newBadge);
    
    await user.save();
    
    res.json({ success: true, badge: newBadge });
  } catch (err) {
    console.error('Badge award error:', err);
    res.status(500).json({ error: 'Badge award failed' });
  }
});

// Complete task
router.post('/complete-task', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const payload = jwt.verify(token, JWT_SECRET);
    const { taskId, taskName } = req.body;
    
    if (!taskId || !taskName) {
      return res.status(400).json({ error: 'Task ID and name are required' });
    }
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    const user = await User.findById(payload.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Check if task already completed
    const existingTask = user.completedTasks?.find(task => task.taskId === taskId);
    if (existingTask) {
      return res.status(409).json({ error: 'Task already completed' });
    }
    
    const newTask = {
      taskId,
      taskName,
      completedAt: new Date()
    };
    
    user.completedTasks = user.completedTasks || [];
    user.completedTasks.push(newTask);
    
    await user.save();
    
    res.json({ success: true, task: newTask });
  } catch (err) {
    console.error('Task completion error:', err);
    res.status(500).json({ error: 'Task completion failed' });
  }
});

export default router;
