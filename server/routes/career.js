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

// Fetch real jobs from multiple sources
async function fetchRemotiveJobs(query, limit = 20, country) {
  try {
    const url = new URL('https://remotive.com/api/remote-jobs');
    url.searchParams.set('search', query);
    if (country && String(country).toUpperCase() === 'IN') {
      url.searchParams.set('location', 'India');
    }
    const agent = new https.Agent({ keepAlive: true });
    const resp = await fetch(url.toString(), { 
      agent, 
      headers: { 'Accept': 'application/json' },
      timeout: 10000 // 10 second timeout
    });
    if (!resp.ok) {
      console.warn('Remotive API error:', resp.status, resp.statusText);
      return [];
    }
    const json = await resp.json();
    const raw = Array.isArray(json?.jobs) ? json.jobs : [];
    const max = Math.min(Number(limit) || 20, 50);
    let items = raw;
    if (country && String(country).toUpperCase() === 'IN') {
      items = raw.filter((j) => 
        String(j.candidate_required_location || '').toLowerCase().includes('india') ||
        String(j.candidate_required_location || '').toLowerCase().includes('anywhere') ||
        String(j.candidate_required_location || '').toLowerCase().includes('remote')
      );
    }
    return items.slice(0, max).map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company_name,
      location: j.candidate_required_location || 'Remote',
      url: j.url,
      salary: j.salary || null,
      publishedAt: j.publication_date,
      tags: j.tags || [],
      description: j.description?.substring(0, 200) + '...' || 'No description available',
      source: 'Remotive'
    }));
  } catch (error) {
    console.error('Error fetching from Remotive:', error.message);
    return [];
  }
}

// Fetch jobs from GitHub Jobs API alternative
async function fetchGitHubJobs(query, limit = 10) {
  try {
    // Using GitHub's search API for job-related repositories and issues
    const searchQuery = `${query} "hiring" OR "job" OR "career" OR "position" type:issue`;
    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(searchQuery)}&sort=updated&per_page=${limit}`;
    
    const resp = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Career-Advisor-App'
      },
      timeout: 10000
    });
    
    if (!resp.ok) {
      console.warn('GitHub API error:', resp.status);
      return [];
    }
    
    const json = await resp.json();
    const items = json.items || [];
    
    return items.slice(0, limit).map((item, index) => ({
      id: `github_${item.id}`,
      title: item.title,
      company: item.repository_url?.split('/').slice(-2, -1)[0] || 'GitHub Community',
      location: 'Remote/Various',
      url: item.html_url,
      salary: null,
      publishedAt: item.created_at,
      tags: item.labels?.map(l => l.name) || [],
      description: item.body?.substring(0, 200) + '...' || 'Check the link for more details',
      source: 'GitHub'
    }));
  } catch (error) {
    console.error('Error fetching from GitHub:', error.message);
    return [];
  }
}

// Enhanced job aggregation from multiple sources
async function fetchJobsFromMultipleSources(query, limit = 20, country) {
  try {
    console.log(`Fetching jobs for query: "${query}" in country: ${country}`);
    
    // Create search queries based on skills and interests
    const skillBasedQueries = [
      query,
      `${query} developer`,
      `${query} engineer`,
      `${query} programmer`
    ];
    
    const jobPromises = [];
    
    // Fetch from Remotive (remote jobs)
    for (const searchQuery of skillBasedQueries.slice(0, 2)) {
      jobPromises.push(fetchRemotiveJobs(searchQuery, Math.ceil(limit / 3), country));
    }
    
    // Fetch from GitHub
    jobPromises.push(fetchGitHubJobs(query, Math.ceil(limit / 4)));
    
    // Wait for all sources to respond
    const results = await Promise.allSettled(jobPromises);
    
    let allJobs = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allJobs = allJobs.concat(result.value);
      } else {
        console.warn(`Job source ${index} failed:`, result.reason?.message || 'Unknown error');
      }
    });
    
    // Remove duplicates based on title and company
    const uniqueJobs = allJobs.filter((job, index, self) => 
      index === self.findIndex(j => 
        j.title.toLowerCase() === job.title.toLowerCase() && 
        j.company.toLowerCase() === job.company.toLowerCase()
      )
    );
    
    // Sort by relevance (newer jobs first, then by source preference)
    uniqueJobs.sort((a, b) => {
      // Prefer Remotive jobs
      if (a.source === 'Remotive' && b.source !== 'Remotive') return -1;
      if (b.source === 'Remotive' && a.source !== 'Remotive') return 1;
      
      // Then sort by date
      const dateA = new Date(a.publishedAt || 0);
      const dateB = new Date(b.publishedAt || 0);
      return dateB - dateA;
    });
    
    console.log(`Found ${uniqueJobs.length} unique jobs from ${results.length} sources`);
    return uniqueJobs.slice(0, limit);
    
  } catch (error) {
    console.error('Error in fetchJobsFromMultipleSources:', error);
    return [];
  }
}

router.get('/jobs', async (req, res) => {
  try {
    const { q, limit = 20, country } = req.query || {};
    const query = String(q || '').trim() || 'software developer';
    const jobs = await fetchJobsFromMultipleSources(query, Number(limit), country);
    res.json({ success: true, jobs, total: jobs.length });
  } catch (e) {
    console.error('career/jobs GET error', e);
    res.status(502).json({ error: 'Failed to fetch jobs', details: e.message });
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const { q, limit = 20, country } = req.body || {};
    const query = String(q || '').trim() || 'software developer';
    const jobs = await fetchJobsFromMultipleSources(query, Number(limit), country);
    res.json({ success: true, jobs, total: jobs.length });
  } catch (e) {
    console.error('career/jobs POST error', e);
    res.status(502).json({ error: 'Failed to fetch jobs', details: e.message });
  }
});

export default router;