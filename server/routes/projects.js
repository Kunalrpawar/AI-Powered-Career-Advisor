import express from 'express';
import jwt from 'jsonwebtoken';
import { generateResponse } from '../config/gemini.js';
import UserEvent from '../schema/UserEvent.js';

const router = express.Router();

// Generate project ideas
function tryGetUserId(req) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return payload.userId || null;
  } catch (_) { return null; }
}

router.post('/generate', async (req, res) => {
  try {
    const { interest, difficulty } = req.body;
    
    const prompt = `Generate ${difficulty || 'mixed'} difficulty project ideas for ${interest}.
    For each project, provide:
    - Title
    - Description (2-3 sentences)
    - Technologies needed
    - Estimated completion time
    - Learning outcomes
    - Optional: Basic starter code structure
    
    Focus on practical, portfolio-worthy projects that demonstrate real skills.`;

    const projects = await generateResponse(prompt);
    
    try {
      await UserEvent.create({
        userId: tryGetUserId(req),
        type: 'project_generate',
        input: { interest, difficulty },
        output: projects.demo ? [projects.mockResponse] : projects.data,
      });
    } catch (_) {}

    res.json({
      success: true,
      projects: projects.demo ? [projects.mockResponse] : projects.data,
      isDemoMode: projects.demo || false
    });
  } catch (error) {
    console.error('Project generation error:', error);
    res.status(500).json({ error: 'Failed to generate projects' });
  }
});

export default router;