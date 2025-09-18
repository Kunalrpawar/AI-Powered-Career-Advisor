import express from 'express';
import jwt from 'jsonwebtoken';
import { generateResponse } from '../config/gemini.js';
import UserEvent from '../schema/UserEvent.js';

const router = express.Router();

function tryGetUserId(req) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return payload.userId || null;
  } catch (_) { return null; }
}

// Get an initial interview question based on role/topic
router.post('/start', async (req, res) => {
  try {
    const { role = 'Software Engineer', topic = 'general' } = req.body || {};
    const prompt = `You are an interviewer for a ${role} position.
Ask ONE concise interview question (${topic} topic). Do not add commentary, only the question.`;
    const ai = await generateResponse(prompt);

    try {
      await UserEvent.create({ userId: tryGetUserId(req), type: 'interview_start', input: { role, topic }, output: ai });
    } catch (_) {}

    res.json({ question: ai.demo ? 'Tell me about a challenging bug you fixed recently.' : ai.data, isDemoMode: ai.demo || false });
  } catch (e) {
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

// Submit answer transcript; get feedback and next question
router.post('/answer', async (req, res) => {
  try {
    const { transcript, previousQuestions = [] } = req.body || {};
    const context = previousQuestions.map((q, i) => `Q${i+1}: ${q}`).join('\n');
    const prompt = `Act as a strict technical interviewer.
Here is the candidate's answer transcript:
"""
${transcript}
"""
Previous context:
${context || 'None'}

1) Provide structured feedback (clarity, technical depth, communication, examples, STAR usage) with 0-10 ratings each and 3 specific improvement tips.
2) Suggest the NEXT single interview question only.`;

    const ai = await generateResponse(prompt);
    const output = ai.demo ? { feedback: 'Demo feedback', nextQuestion: 'What is a closure in JavaScript?' } : undefined;

    try {
      await UserEvent.create({ userId: tryGetUserId(req), type: 'interview_answer', input: { transcript, previousQuestions }, output: ai.demo ? output : { raw: ai.data } });
    } catch (_) {}

    if (ai.demo) {
      return res.json({
        isDemoMode: true,
        feedback: output.feedback,
        nextQuestion: output.nextQuestion,
      });
    }

    // Basic parsing: separate feedback and next question if possible
    const text = ai.data;
    const split = text.split(/Next question[:\-]/i);
    const feedback = split[0]?.trim() || text;
    const nextQuestion = split[1]?.trim() || 'Can you explain event loop in Node.js?';
    res.json({ isDemoMode: false, feedback, nextQuestion });
  } catch (e) {
    res.status(500).json({ error: 'Failed to process answer' });
  }
});

export default router;


