import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { generateResponse } from '../config/gemini.js';
import UserEvent from '../schema/UserEvent.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Dummy job dataset for matching
const dummyJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Remote',
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    salary: '$70,000 - $90,000'
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'San Francisco, CA',
    skills: ['Node.js', 'React', 'MongoDB', 'Express'],
    salary: '$80,000 - $120,000'
  },
  {
    id: 3,
    title: 'AI/ML Engineer',
    company: 'DataTech',
    location: 'New York, NY',
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Science'],
    salary: '$90,000 - $140,000'
  }
];

function tryGetUserId(req) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return payload.userId || null;
  } catch (_) { return null; }
}

// Match jobs based on profile
router.post('/match', upload.single('resume'), async (req, res) => {
  try {
    const { profileSummary } = req.body;
    
    const prompt = `Based on this profile: "${profileSummary}", 
    match the candidate to these job opportunities: ${JSON.stringify(dummyJobs)}.
    
    Rank the jobs by fit percentage and explain why each is a good match.
    Consider skills alignment, experience level, and growth potential.`;

    const matches = await generateResponse(prompt);
    
    try {
      await UserEvent.create({
        userId: tryGetUserId(req),
        type: 'job_match',
        input: { profileSummary },
        output: matches.demo ? dummyJobs.map(job => ({ ...job, fitPercentage: Math.floor(Math.random() * 40) + 60 })) : matches.data,
      });
    } catch (_) {}

    res.json({
      success: true,
      matches: matches.demo ? dummyJobs.map(job => ({ ...job, fitPercentage: Math.floor(Math.random() * 40) + 60 })) : matches.data,
      isDemoMode: matches.demo || false
    });
  } catch (error) {
    console.error('Job matching error:', error);
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

// Generate cover letter
router.post('/cover-letter', async (req, res) => {
  try {
    const { jobTitle, company, userProfile } = req.body;
    
    const prompt = `Write a professional cover letter for:
    - Position: ${jobTitle} at ${company}
    - Candidate profile: ${userProfile}
    
    Make it personalized, enthusiastic, and highlight relevant skills.
    Keep it concise (3-4 paragraphs) and professional.`;

    const coverLetter = await generateResponse(prompt);
    
    res.json({
      success: true,
      coverLetter: coverLetter.demo ? 
        `Dear Hiring Manager,\n\nI am excited to apply for the ${jobTitle} position at ${company}. With my background in technology and passion for innovation, I believe I would be a valuable addition to your team.\n\n[This is a demo. Add your Gemini API key for personalized cover letters.]\n\nThank you for your consideration.\n\nBest regards,` 
        : coverLetter.data,
      isDemoMode: coverLetter.demo || false
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

export default router;