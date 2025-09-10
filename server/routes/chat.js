import express from 'express';
import jwt from 'jsonwebtoken';
import { generateResponse } from '../config/gemini.js';
import UserEvent from '../schema/UserEvent.js';

const router = express.Router();

// AI Mentor chat
function tryGetUserId(req) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return payload.userId || null;
  } catch (_) { return null; }
}

router.post('/message', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const prompt = `You are an experienced career mentor and coach. 
    The user asked: "${message}"
    Previous context: ${context || 'None'}
    
    Provide helpful, motivational career advice. Be encouraging and specific.
    If they ask about interviews, provide actionable tips.
    If they ask about skills, suggest learning resources.
    Keep responses conversational and supportive.`;

    const response = await generateResponse(prompt);
    
    try {
      await UserEvent.create({
        userId: tryGetUserId(req),
        type: 'chat',
        input: { message, context },
        output: response.demo ? { message: 'demo' } : { message: response.data },
      });
    } catch (_) {}

    res.json({
      success: true,
      message: response.demo ? 
        "I'm here to help with your career journey! As a demo, I'd love to provide personalized advice once the Gemini API is configured. What specific career challenges are you facing?" 
        : response.data,
      isDemoMode: response.demo || false
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

export default router;