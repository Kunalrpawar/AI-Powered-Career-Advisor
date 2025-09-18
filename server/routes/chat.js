import express from 'express';
import jwt from 'jsonwebtoken';
import { generateResponse } from '../config/gemini.js';
import { loadKnowledgeBase } from '../rag/simpleRetriever.js';
import { getVectorStore } from '../rag/embeddingStore.js';
import { BM25 } from '../rag/bm25.js';
import { runMentorOrchestrator } from '../mentor/orchestrator.js';
import User from '../schema/User.js';
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

    // Tool-augmented mentor orchestrator (pre-RAG)
    const orch = await runMentorOrchestrator({ message, profile: undefined, history: context });

    // RAG with embeddings: retrieve relevant guidance
    const store = await getVectorStore(loadKnowledgeBase);
    const kb = loadKnowledgeBase();
    const bm25 = new BM25(kb);
    const query = `${message}\n${context || ''}`;
    const embTop = await store.retrieve(query, 6);
    const bmTop = bm25.topK(query, 6);
    // Hybrid fusion by normalized score + small tie-break on embeddings
    const all = new Map();
    const norm = (arr) => {
      const max = Math.max(...arr.map((x) => x.score || 0), 1e-6);
      return arr.map((x) => ({ ...x, score: (x.score || 0) / max }));
    };
    const eN = norm(embTop);
    const bN = norm(bmTop);
    for (const d of eN) all.set(d.id, { doc: d, e: d.score, b: 0 });
    for (const d of bN) {
      const prev = all.get(d.id) || { doc: d, e: 0, b: 0 };
      all.set(d.id, { doc: prev.doc, e: prev.e, b: d.score });
    }
    const fused = Array.from(all.values())
      .map((v) => ({ ...v.doc, score: 0.6 * v.e + 0.4 * v.b }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    const retrieved = fused;
    const ragContext = retrieved
      .map((d, idx) => `[#${idx + 1}] ${d.title}: ${d.text}`)
      .join('\n\n');

    // Personalization: user profile + recent history
    let userProfile = 'Anonymous user';
    let recentHistory = '';
    const userId = tryGetUserId(req);
    if (userId) {
      try {
        const user = await User.findById(userId).lean();
        if (user) userProfile = `${user.name} <${user.email}>`;
        const events = await UserEvent.find({ userId }).sort({ createdAt: -1 }).limit(10).lean();
        recentHistory = events
          .map((e) => `${e.type}: ${JSON.stringify(e.input || {}).slice(0, 200)}`)
          .join('\n');
      } catch (_) {}
    }

    const prompt = `You are an experienced, licensed-style career counselor for Indian students and early professionals.
Use the retrieved knowledge to give accurate, practical and ethical guidance.

Retrieved knowledge (use selectively, cite with [#n] where used):
${ragContext || 'None'}

Tool outputs (use if relevant, verify with retrieved knowledge):
${orch?.toolOutput || 'None'}

Chat history summary:
${context || 'None'}

User profile:
${userProfile}

Recent user activity (last 10 events):
${recentHistory || 'None'}

User message:
"""
${message}
"""

Response requirements:
- Be supportive and specific with step-by-step actions.
- If the user goal is unclear, ask up to 2 clarifying questions.
- Where appropriate, propose a 30-60-90 day roadmap.
- Keep it concise (150-220 words) and reference sources like [#1], [#2] where applied.
`;

    const response = await generateResponse(prompt);
    
    try {
      await UserEvent.create({
        userId: tryGetUserId(req),
        type: 'chat',
        input: { message, context, retrieved: retrieved.map(r => ({ id: r.id, title: r.title })) },
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

// Personalized profile message
router.post('/personalized-profile', async (req, res) => {
  try {
    const { userData } = req.body;
    const { name, avatar, dreams, interests, class: userClass, gender } = userData;
    
    const prompt = `Create a personalized, encouraging message for a student named ${name}. Here are their details:
    - Avatar: ${avatar}
    - Dreams/Goals: ${dreams}
    - Interests: ${interests?.join(', ') || 'Not specified'}
    - Education Level: ${userClass}
    - Gender: ${gender || 'Not specified'}
    
    Write a motivational and personalized message (2-3 sentences) that:
    1. Acknowledges their interests and dreams
    2. Encourages them on their learning journey
    3. Relates to their chosen avatar if possible
    4. Is inspiring and student-friendly
    
    Keep it concise, positive, and engaging. Use emojis appropriately.`;
    
    const response = await generateResponse(prompt);
    
    if (response.demo) {
      // Demo mode response
      const demoMessage = `Hello ${name}! 🌟 Your passion for ${interests?.join(' and ') || 'learning'} and your dreams of ${dreams} are truly inspiring! Keep pushing forward on your educational journey - every step brings you closer to achieving your goals. ${avatar === 'student' ? '📚' : avatar === 'programmer' ? '💻' : '🚀'} You've got this!`;
      res.json({ message: demoMessage });
    } else if (response.success) {
      res.json({ message: response.data.trim() });
    } else {
      throw new Error(response.error || 'Failed to generate response');
    }
  } catch (error) {
    console.error('Personalized profile generation error:', error);
    res.status(500).json({ error: 'Failed to generate personalized message' });
  }
});

export default router;