import express from 'express';
import jwt from 'jsonwebtoken';
import Document from '../schema/Document.js';
import User from '../schema/User.js';
import UserEvent from '../schema/UserEvent.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [documentsCount, skillCount, careerCount, projectCount, jobCount] = await Promise.all([
      Document.countDocuments({ userId: req.userId }),
      UserEvent.countDocuments({ userId: req.userId, type: 'skill_analysis' }),
      UserEvent.countDocuments({ userId: req.userId, type: 'career_explore' }),
      UserEvent.countDocuments({ userId: req.userId, type: 'project_generate' }),
      UserEvent.countDocuments({ userId: req.userId, type: 'job_match' }),
    ]);
    res.json({
      skillsAnalyzed: skillCount,
      careerExplored: careerCount,
      projectsCompleted: projectCount,
      achievements: 0,
      documentsCount,
      jobsMatched: jobCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

router.get('/activities', requireAuth, async (req, res) => {
  try {
    const events = await UserEvent.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    const activities = events.map((e) => ({
      action: e.type.replace('_', ' '),
      time: new Date(e.createdAt).toLocaleString(),
      type: e.type,
    }));
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load activities' });
  }
});

export default router;


