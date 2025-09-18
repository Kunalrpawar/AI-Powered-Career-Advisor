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

function catalogByInterest(interest, difficulty) {
  const d = (lvl) => lvl || difficulty || 'beginner';
  const lower = (interest || 'General').toLowerCase();
  const common = (lvl) => ({
    estimatedTime: lvl === 'advanced' ? '6-10 weeks' : lvl === 'intermediate' ? '3-5 weeks' : '1-2 weeks'
  });
  const make = (title, lvl, description, technologies, learningOutcomes) => ({
    title, difficulty: d(lvl), description, technologies, estimatedTime: common(d(lvl)).estimatedTime, learningOutcomes
  });

  if (lower.includes('web')) return [
    make('Accessible Gov Services Portal', 'intermediate', 'Build an accessible, multilingual portal for public services with status tracking and offline-ready PWA.', ['React', 'TypeScript', 'PWA', 'i18n'], ['Accessibility (WCAG)', 'PWA caching', 'Form UX']),
    make('Local Marketplace with Escrow', 'advanced', 'Create a community marketplace with wallet-based escrow and dispute resolution workflows.', ['Next.js', 'Prisma', 'Stripe', 'Webhooks'], ['Payments', 'DB schema design', 'Webhooks']),
    make('Realtime Classroom Q&A Board', 'beginner', 'A live-updating Q&A board with upvote ranking and teacher moderation.', ['React', 'Socket.io'], ['Sockets', 'Optimistic UI', 'Moderation UX']),
    make('Nutrition Recipe Recommender', 'intermediate', 'Recommend recipes from pantry items with macro breakdown and printable shopping lists.', ['React', 'Node.js', 'OpenAPI'], ['API design', 'State management', 'Print styles']),
    make('Career Roadmap Planner', 'beginner', 'Interactive roadmap tool to pick a role and drag tasks on a timeline with progress tracking.', ['React', 'Dnd-kit', 'Tailwind'], ['DnD', 'State charts', 'UX flows'])
  ];

  if (lower.includes('mobile')) return [
    make('Campus Shuttle Tracker', 'beginner', 'Track shuttle live locations with ETA and notifications for favorite stops.', ['React Native', 'Expo', 'Maps'], ['Mobile maps', 'Push notifications', 'Background tasks']),
    make('Offline Notes with Sync', 'intermediate', 'End-to-end encrypted notes that work offline and sync when online.', ['Flutter', 'SQLite', 'CRDT'], ['Local storage', 'Sync conflicts', 'Encryption basics']),
    make('Health Habit Coach', 'advanced', 'Daily habits app with reminders, streaks, and adaptive goals using on-device ML.', ['Kotlin/Swift', 'CoreML/MLKit'], ['Native modules', 'Notifications', 'Lightweight ML'])
  ];

  if (lower.includes('ai') || lower.includes('machine')) return [
    make('Interview Answer Quality Rater', 'intermediate', 'Rate interview answers for clarity and depth using RAG over a rubric.', ['Python', 'FastAPI', 'OpenAI / Gemini'], ['RAG', 'Prompt eval', 'API server']),
    make('Code Review Assistant', 'advanced', 'Static analysis + LLM suggestions for PRs with risk scoring.', ['Node.js', 'AST', 'LLM API'], ['AST parsing', 'Heuristics', 'LLM grounding']),
    make('Personalized Study Planner', 'beginner', 'Generate spaced-repetition schedules from a syllabus using embeddings.', ['Python', 'Faiss', 'Streamlit'], ['Embeddings', 'Scheduling', 'UI basics'])
  ];

  if (lower.includes('data')) return [
    make('District Education Analytics', 'intermediate', 'Aggregate district-wise performance, visualize disparities, and export policy briefs.', ['Python', 'Pandas', 'Superset'], ['ETL', 'Viz best practices', 'Storytelling']),
    make('Job Market Trends Miner', 'advanced', 'Scrape job listings, classify skills, and track trend indices per city.', ['Airflow', 'dbt', 'DuckDB'], ['Pipelines', 'Feature engineering', 'Time series']),
    make('Personal Finance Dashboard', 'beginner', 'Parse SMS/email bank alerts to auto-categorize spending and budgets.', ['Python', 'Regex', 'Streamlit'], ['Parsing', 'Categorization', 'Charts'])
  ];

  if (lower.includes('cyber')) return [
    make('Phishing Simulation Platform', 'intermediate', 'Run phishing simulations and awareness scoring for small orgs.', ['Node.js', 'Nodemailer', 'React'], ['Email flows', 'Security scoring', 'Reporting']),
    make('Vulnerability Scanner Lite', 'advanced', 'Lightweight scanner for common misconfigs with CI integration.', ['Go', 'Cobra', 'CI'], ['Scanning', 'Report parsers', 'CI pipelines']),
    make('Password Hygiene Coach', 'beginner', 'Educate users with a password strength meter and breach checks.', ['React', 'k-Anonymity API'], ['Security UX', 'APIs', 'Hashing concepts'])
  ];

  if (lower.includes('game')) return [
    make('Physics Puzzle Platformer', 'beginner', 'Browser puzzle game with realistic physics and level editor.', ['Phaser', 'Matter.js'], ['Physics', 'Level design', 'Export/import']),
    make('Multiplayer Quiz Arena', 'intermediate', 'Realtime quiz with matchmaking and anti-cheat.', ['Unity', 'Netcode'], ['Matchmaking', 'State sync', 'Anticheat basics']),
    make('Procedural Dungeon Crawler', 'advanced', 'Roguelike with procedural generation and loot economy.', ['Godot', 'GDScript'], ['Procgen', 'AI pathfinding', 'Economy tuning'])
  ];

  if (lower.includes('blockchain')) return [
    make('Community Grants DAO', 'intermediate', 'Token-gated voting for microgrants with quadratic funding.', ['Solidity', 'Hardhat', 'Next.js'], ['Smart contracts', 'Wallets', 'Security reviews']),
    make('Carbon Credit Marketplace', 'advanced', 'Tokenize carbon credits with verification workflows.', ['Solidity', 'Subgraphs'], ['On-chain data', 'Compliance', 'Audits']),
    make('NFT Ticketing Lite', 'beginner', 'Event tickets with QR validation and resale limits.', ['Solidity', 'IPFS'], ['Minting', 'QR flows', 'Secondary sales'])
  ];

  if (lower.includes('iot')) return [
    make('Smart Irrigation Controller', 'intermediate', 'Auto-watering using soil moisture and weather forecasts with a web panel.', ['ESP32', 'MQTT', 'React'], ['Sensors', 'MQTT', 'Dashboards']),
    make('Home Air Quality Monitor', 'beginner', 'Measure PM2.5/CO2 and alert thresholds via mobile.', ['Arduino', 'BLE'], ['Sensors', 'BLE comms', 'Alerts']),
    make('Warehouse Tracker', 'advanced', 'Track pallets with UWB tags and analytics.', ['Raspberry Pi', 'UWB', 'InfluxDB'], ['RTLS', 'Edge processing', 'Time-series'])
  ];

  if (lower.includes('devops')) return [
    make('GitOps Starter', 'beginner', 'Deploy a sample app via GitOps with preview environments.', ['Docker', 'K8s', 'ArgoCD'], ['Containers', 'Manifests', 'GitOps']),
    make('SLO & Error Budget Monitor', 'intermediate', 'Track SLOs and error budgets with alerts and runbooks generation.', ['Prometheus', 'Grafana', 'Alertmanager'], ['SRE basics', 'SLIs/SLOs', 'Alerting']),
    make('Cost Explorer for K8s', 'advanced', 'Allocate cluster costs by namespace/team with rightsizing tips.', ['Kubecost', 'BigQuery'], ['Cost analysis', 'Attribution', 'Optimization'])
  ];

  if (lower.includes('ui') || lower.includes('ux')) return [
    make('Design System Playground', 'intermediate', 'Build a token-based design system with accessible components and docs.', ['Figma', 'React', 'Tailwind'], ['Design tokens', 'A11y', 'Docs site']),
    make('Onboarding Flow Tester', 'beginner', 'Prototype and test onboarding flows with analytics and heatmaps.', ['React', 'Hotjar'], ['Experiment design', 'Form UX', 'Analytics']),
    make('User Research Repository', 'advanced', 'Centralize interview notes, tags, and insights with search.', ['Next.js', 'Elastic'], ['Repository design', 'Tagging', 'Insights'])
  ];

  // Default generic but varied
  return [
    make('Local Services Finder', 'beginner', 'Find and review local services with maps and filters.', ['React', 'Maps'], ['Filters', 'Maps', 'Cards layout']),
    make('Study Planner Pro', 'intermediate', 'Smarter study planner with spaced repetition and reminders.', ['Node.js', 'Cron'], ['Scheduling', 'CRON', 'Reminders']),
    make('Community Q&A Forum', 'advanced', 'StackOverflow-like forum with moderation and badges.', ['Next.js', 'Postgres'], ['Auth', 'Moderation', 'Search'])
  ];
}

function generateDemoProjects(interest = 'General', difficulty = 'beginner') {
  const pool = catalogByInterest(interest, difficulty);
  // Pick first 5 distinct
  return pool.slice(0, 5);
}

router.post('/generate', async (req, res) => {
  try {
    const { interest, difficulty } = req.body || {};

    const prompt = `You are an experienced mentor.
Generate 5 to 7 unique ${difficulty || 'mixed'} difficulty ${interest || 'software'} project ideas.
Return STRICT JSON only with this schema:
{
  "projects": [
    {
      "title": string,
      "difficulty": "beginner" | "intermediate" | "advanced",
      "description": string,
      "technologies": string[],
      "estimatedTime": string,
      "learningOutcomes": string[]
    }
  ]
}
Rules:
- Ensure ideas are legit, practical, and portfolio-worthy.
- Must be tailored to interest area: ${interest || 'General'}.
- Match the selected difficulty: ${difficulty || 'mixed'}.
- All titles should be distinct and non-generic.
- Keep descriptions concise (2-4 sentences).
Example JSON:
{
  "projects": [
    {
      "title": "Accessible Gov Services Portal",
      "difficulty": "intermediate",
      "description": "Build an accessible, multilingual portal for public services with status tracking.",
      "technologies": ["React", "TypeScript", "PWA"],
      "estimatedTime": "3-5 weeks",
      "learningOutcomes": ["Accessibility", "PWA", "Form UX"]
    }
  ]
}`;

    const ai = await generateResponse(prompt);
    
    try {
      await UserEvent.create({
        userId: tryGetUserId(req),
        type: 'project_generate',
        input: { interest, difficulty },
        output: ai,
      });
    } catch (_) {}

    // Parse JSON or fall back
    if (ai.demo) {
      return res.json({ success: true, projects: generateDemoProjects(interest, difficulty), isDemoMode: true });
    }
    let parsed = null;
    try {
      const text = ai.data || '';
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      const slice = start >= 0 && end >= 0 ? text.slice(start, end + 1) : '{}';
      parsed = JSON.parse(slice);
    } catch (_) {}
    let list = Array.isArray(parsed?.projects) ? parsed.projects : generateDemoProjects(interest, difficulty);
    // Ensure at least 5 unique; supplement from catalog
    if (!Array.isArray(list)) list = [];
    const catalog = catalogByInterest(interest, difficulty);
    const existingTitles = new Set(list.map((p) => p.title));
    for (const cand of catalog) {
      if (list.length >= 5) break;
      if (!existingTitles.has(cand.title)) {
        list.push(cand);
        existingTitles.add(cand.title);
      }
    }
    res.json({ success: true, projects: list, isDemoMode: false });
  } catch (error) {
    console.error('Project generation error:', error);
    res.status(500).json({ error: 'Failed to generate projects' });
  }
});

export default router;