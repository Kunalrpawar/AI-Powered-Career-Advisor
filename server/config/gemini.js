import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI - will be configured when called
let genAI = null;
let GEMINI_API_KEY = null;

const initializeGemini = () => {
  if (!GEMINI_API_KEY) {
    GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    console.log(' Debug - GEMINI_API_KEY loaded:', GEMINI_API_KEY ? '***' + GEMINI_API_KEY.slice(-4) : 'NOT FOUND');
    console.log(' Debug - API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'demo-key');
  }
  return genAI;
};

const getGeminiModel = () => {
  try {
    // Initialize Gemini if not already done
    const ai = initializeGemini();
    
    // Check if API key is properly configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'demo-key' || GEMINI_API_KEY.length < 10) {
      console.warn('GEMINI_API_KEY not configured. Running in demo mode.');
      return null;
    }
    console.log(' GEMINI_API_KEY configured successfully!');
    return ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
  } catch (error) {
    console.error('Error initializing Gemini model:', error);
    return null;
  }
};

const generateResponse = async (prompt) => {
  try {
    const model = getGeminiModel();
    if (!model) {
      console.warn('Using demo mode - no valid model available');
      return { 
        error: 'Gemini API not configured. Please add GEMINI_API_KEY to your .env file.',
        demo: true,
        mockResponse: generateMockResponse(prompt)
      };
    }
    
    console.log(' Generating AI response...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(' AI response generated successfully');
    return { success: true, data: text };
  } catch (error) {
    console.error(' Error generating response:', error.message);
    
    // Try different model if first one fails
    if (error.message.includes('404 Not Found') || error.message.includes('not found')) {
      console.log(' Trying alternative model...');
      try {
        const altModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await altModel.generateContent(prompt);
        const response = await result.response;
        console.log(' Alternative model worked!');
        return { success: true, data: response.text() };
      } catch (altError) {
        console.error(' Alternative model also failed:', altError.message);
      }
    }
    
    return { 
      error: 'Failed to generate AI response. Using demo mode.',
      demo: true,
      mockResponse: generateMockResponse(prompt)
    };
  }
};

const generateMockResponse = (prompt) => {
  const mockResponses = {
    skillGap: {
      strengths: ['JavaScript', 'React', 'Problem Solving', 'Communication'],
      weaknesses: ['Backend Development', 'Database Design', 'System Architecture', 'DevOps'],
      recommendations: [
        { skill: 'Node.js', priority: 'High', resources: ['FreeCodeCamp', 'MDN Docs', 'Node.js Official Docs'] },
        { skill: 'MongoDB', priority: 'Medium', resources: ['MongoDB University', 'YouTube Tutorials'] },
        { skill: 'Docker', priority: 'Medium', resources: ['Docker Official Tutorials', 'Pluralsight'] }
      ],
      overallScore: 75,
      message: 'Demo mode: Add your Gemini API key for personalized analysis'
    },
    career: [
      {
        title: 'Frontend Developer',
        description: 'Build user interfaces and experiences for web applications',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
        salaryRange: '$60,000 - $120,000',
        growthRate: '13%',
        roadmap: ['Learn HTML/CSS', 'Master JavaScript', 'Learn React', 'Build Portfolio', 'Learn TypeScript']
      },
      {
        title: 'Full Stack Developer',
        description: 'Develop both frontend and backend applications',
        requiredSkills: ['JavaScript', 'Node.js', 'React', 'Database', 'API Design'],
        salaryRange: '$70,000 - $140,000',
        growthRate: '15%',
        roadmap: ['Learn Backend', 'Master Databases', 'Learn DevOps', 'Build Full Apps']
      }
    ],
    projects: [
      {
        title: 'Personal Portfolio Website',
        difficulty: 'Beginner',
        description: 'Create a responsive portfolio to showcase your skills and projects',
        technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
        estimatedTime: '2-3 days',
        learningOutcomes: ['Responsive Design', 'Component Architecture', 'Deployment']
      },
      {
        title: 'Task Management App',
        difficulty: 'Intermediate',
        description: 'Build a full-stack task management application with user authentication',
        technologies: ['React', 'Node.js', 'MongoDB', 'JWT'],
        estimatedTime: '1-2 weeks',
        learningOutcomes: ['Full Stack Development', 'Authentication', 'Database Design']
      }
    ],
    chat: {
      technicalInterview: `**Technical Interview Preparation Tips:**

1. **Practice Coding Problems**
   - Use platforms like LeetCode, HackerRank, or CodeSignal
   - Focus on data structures and algorithms
   - Practice explaining your thought process out loud

2. **System Design Basics**
   - Learn about scalability, load balancing, and databases
   - Practice designing simple systems like a URL shortener
   - Understand trade-offs between different approaches

3. **Behavioral Questions**
   - Prepare STAR method examples (Situation, Task, Action, Result)
   - Practice common questions about teamwork, challenges, and goals
   - Be ready to discuss your projects and experiences

4. **Company Research**
   - Learn about the company's tech stack and products
   - Prepare thoughtful questions about the role and team
   - Understand their culture and values

*Demo mode: Add your Gemini API key for personalized interview advice!*`
    }
  };
  
  if (prompt.includes('skill') || prompt.includes('resume') || prompt.includes('analyze')) return mockResponses.skillGap;
  if (prompt.includes('career') || prompt.includes('path') || prompt.includes('explore')) return mockResponses.career;
  if (prompt.includes('project') || prompt.includes('hackathon') || prompt.includes('generate')) return mockResponses.projects;
  if (prompt.includes('interview') || prompt.includes('technical') || prompt.includes('prepare')) return mockResponses.chat.technicalInterview;
  
  return `**AI Career Mentor Response (Demo Mode)**

I'm here to help with your career journey! I can assist with:
- Technical interview preparation
- Career path exploration
- Skill gap analysis
- Project recommendations
- Job matching and cover letters

*Note: This is demo mode. Add your Gemini API key to get personalized AI responses!*

What specific career challenge can I help you with today?`;
};

export {
  generateResponse,
  getGeminiModel
};