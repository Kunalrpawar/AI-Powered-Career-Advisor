import express from 'express';
import jwt from 'jsonwebtoken';
import { generateResponse } from '../config/gemini.js';
import UserEvent from '../schema/UserEvent.js';
import https from 'https';

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

// Fetch real jobs from Remotive API (remote-friendly job board)
async function fetchRemotiveJobs(query, limit = 20, country) {
  const url = new URL('https://remotive.com/api/remote-jobs');
  url.searchParams.set('search', query);
  if (country && String(country).toUpperCase() === 'IN') {
    // Remotive supports a 'location' hint; still filter post-fetch to be safe
    url.searchParams.set('location', 'India');
  }
  const agent = new https.Agent({ keepAlive: true });
  const resp = await fetch(url.toString(), { agent, headers: { 'Accept': 'application/json' } });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text.slice(0, 500));
  }
  const json = await resp.json();
  const raw = Array.isArray(json?.jobs) ? json.jobs : [];
  const max = Math.min(Number(limit) || 20, 50);
  let items = raw;
  if (country && String(country).toUpperCase() === 'IN') {
    items = raw.filter((j) => String(j.candidate_required_location || '').toLowerCase().includes('india'));
  }
  return items.slice(0, max).map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company_name,
    location: j.candidate_required_location,
    url: j.url,
    salary: j.salary || null,
    publishedAt: j.publication_date,
    tags: j.tags || []
  }));
}

router.get('/jobs', async (req, res) => {
  try {
    const { q, limit = 20, country } = req.query || {};
    const query = String(q || '').trim() || 'software developer';
    const jobs = await fetchRemotiveJobs(query, Number(limit), country);
    res.json({ success: true, jobs });
  } catch (e) {
    console.error('career/jobs GET error', e);
    res.status(502).json({ error: 'Failed to fetch jobs' });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const { q, limit = 20, country } = req.body || {};
    const query = String(q || '').trim() || 'software developer';
    const jobs = await fetchRemotiveJobs(query, Number(limit), country);
    res.json({ success: true, jobs });
  } catch (e) {
    console.error('career/jobs POST error', e);
    res.status(502).json({ error: 'Failed to fetch jobs' });
  }
});

export default router;