# AI Career Advisor

An AI-powered career guidance platform using Google's Gemini AI to help users explore careers, match with jobs, and generate personalized learning paths.
This will help students and graduates to find there right carrer path

## Features

- AI Mentor Chat for career guidance
- Career Path Explorer with personalized recommendations
- Job Matcher with cover letter generation
- Project Generator based on skills and interests
- Skill Gap Analyzer
- Interview Assistant
- Multi-language support

## Tech Stack

Frontend: React 18, TypeScript, Tailwind CSS, Vite
Backend: Node.js, Express.js, Google Gemini AI
ML: Python, Scikit-learn, Pandas
Deployment: Vercel, Docker

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Hackgen
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create .env file with:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   NODE_ENV=development
   ```

4. Start the application
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start frontend and backend
- `npm run client` - Start frontend only
- `npm run server` - Start backend only
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## API Endpoints

- POST /api/chat/message - Chat with AI mentor
- POST /api/career/explore - Explore career paths
- POST /api/jobs/match - Match skills with jobs
- POST /api/projects/generate - Generate project ideas
- POST /api/skill-gap/analyze - Analyze skill gaps
- POST /api/auth/register - Register user
- POST /api/auth/login - User login
- GET /api/dashboard - Get user dashboard

## Languages Supported

English, Hindi, Urdu, Kashmiri, Dogri


Send a PR to collab
