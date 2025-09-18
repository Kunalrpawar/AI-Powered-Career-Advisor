import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../schema/User.js';

const router = express.Router();

// Badge definitions
const BADGES = {
  'career-mapper': {
    id: 'career-mapper',
    name: 'Career Explorer',
    description: 'Completed career mapping for the first time',
    image: '/badge1.png',
    category: 'career'
  },
  'mentor-booker': {
    id: 'mentor-booker',
    name: 'Mentorship Seeker',
    description: 'Booked first mentor session',
    image: '/badge2.png',
    category: 'skill'
  },
  'aptitude-ace': {
    id: 'aptitude-ace',
    name: 'Aptitude Master',
    description: 'Completed aptitude examination',
    image: '/badge3.png',
    category: 'aptitude'
  }
};

// Middleware to get user from token
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Award a badge to user
router.post('/award', authenticateUser, async (req, res) => {
  try {
    const { badgeId } = req.body;
    const user = req.user;
    
    if (!BADGES[badgeId]) {
      return res.status(400).json({ error: 'Invalid badge ID' });
    }
    
    // Check if user already has this badge
    const existingBadge = user.badges.find(badge => badge.id === badgeId);
    if (existingBadge) {
      return res.status(409).json({ 
        error: 'Badge already earned',
        badge: existingBadge
      });
    }
    
    // Award the badge
    const badge = {
      ...BADGES[badgeId],
      earnedAt: new Date()
    };
    
    user.badges.push(badge);
    await user.save();
    
    res.json({
      success: true,
      message: 'Badge awarded successfully!',
      badge: badge,
      isNewBadge: true
    });
  } catch (error) {
    console.error('Badge award error:', error);
    res.status(500).json({ error: 'Failed to award badge' });
  }
});

// Get user's badges
router.get('/my-badges', authenticateUser, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      badges: user.badges || [],
      totalBadges: user.badges?.length || 0
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Failed to get badges' });
  }
});

// Get all available badges
router.get('/available', (req, res) => {
  res.json({
    badges: Object.values(BADGES)
  });
});

export default router;