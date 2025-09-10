import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { generateResponse } from '../config/gemini.js';
import UserEvent from '../schema/UserEvent.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function tryGetUserId(req) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return payload.userId || null;
  } catch (_) { return null; }
}

// Analyze skills from resume or manual input
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { skills } = req.body;
    let prompt = '';

    if (req.file) {
      // In production, you'd extract text from PDF/DOC file
      prompt = `Analyze this resume and provide a skill gap analysis for a tech career. 
      Return a JSON object with strengths, weaknesses, recommendations, and an overall score (0-100).`;
    } else if (skills) {
      prompt = `Analyze these skills: "${skills}" for a tech career. 
      Provide strengths, skill gaps, learning recommendations, and an overall score.
      Focus on modern tech industry requirements.`;
    }

    const analysis = await generateResponse(prompt);
    
    // Persist event if possible
    try {
      await UserEvent.create({
        userId: tryGetUserId(req),
        type: 'skill_analysis',
        input: { skills: skills || '(resume)' },
        output: analysis.demo ? analysis.mockResponse : analysis.data,
      });
    } catch (_) {}

    res.json({
      success: true,
      analysis: analysis.demo ? analysis.mockResponse : analysis.data,
      isDemoMode: analysis.demo || false
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze skills' });
  }
});

export default router;