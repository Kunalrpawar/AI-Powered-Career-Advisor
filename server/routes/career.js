import express from 'express';
import jwt from 'jsonwebtoken';
import { generateResponse } from '../config/gemini.js';
import UserEvent from '../schema/UserEvent.js';

const router = express.Router();

// Explore career paths
function tryGetUserId(req) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return payload.userId || null;
  } catch (_) { return null; }
}

router.post('/explore', async (req, res) => {
  try {
    const { interests, currentSkills } = req.body;
    
    const prompt = `Based on interests: "${interests}" and current skills: "${currentSkills}", 
    suggest 3-5 career paths in tech. For each path, provide:
    - Job title and description
    - Required skills
    - Salary range
    - Growth prospects
    - Learning roadmap (3-4 steps from beginner to advanced)`;

    const careerPaths = await generateResponse(prompt);
    
    try {
      await UserEvent.create({
        userId: tryGetUserId(req),
        type: 'career_explore',
        input: { interests, currentSkills },
        output: careerPaths.demo ? careerPaths.mockResponse : careerPaths.data,
      });
    } catch (_) {}

    res.json({
      success: true,
      paths: careerPaths.demo ? careerPaths.mockResponse : careerPaths.data,
      isDemoMode: careerPaths.demo || false
    });
  } catch (error) {
    console.error('Career exploration error:', error);
    res.status(500).json({ error: 'Failed to explore careers' });
  }
});

export default router;