import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import mammoth from 'mammoth';
import { generateResponse } from '../config/gemini.js';
import UserEvent from '../schema/UserEvent.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, DOC, DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

function tryGetUserId(req) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return payload.userId || null;
  } catch (_) { return null; }
}

// Extract text from uploaded file
async function extractTextFromFile(file) {
  try {
    const buffer = file.buffer;
    const mimetype = file.mimetype;
    
    if (mimetype === 'application/pdf') {
      // For now, return a placeholder message for PDF files
      // We'll implement PDF parsing later with a different library
      return `PDF file uploaded: ${file.originalname}. Please note: PDF text extraction is temporarily disabled. For better results, please convert your resume to DOCX format or enter your skills manually.`;
    } else if (mimetype === 'application/msword' || 
               mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Extract text from DOC/DOCX
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from file. Please ensure the file is not corrupted.');
  }
}

// Enhanced skill extraction function
function extractSkillsFromText(text) {
  const skillKeywords = [
    // Programming Languages
    'javascript', 'java', 'python', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    'typescript', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash', 'powershell',
    
    // Frontend Technologies
    'react', 'angular', 'vue', 'html', 'css', 'sass', 'scss', 'less', 'bootstrap', 'tailwind',
    'jquery', 'redux', 'mobx', 'webpack', 'babel', 'next.js', 'nuxt.js', 'gatsby',
    
    // Backend Technologies
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net',
    'fastapi', 'nestjs', 'koa', 'hapi', 'restify',
    
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'oracle',
    'sql server', 'dynamodb', 'cassandra', 'neo4j', 'firebase',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github actions',
    'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'ci/cd', 'devops',
    
    // Mobile Development
    'react native', 'flutter', 'ionic', 'xamarin', 'android', 'ios', 'swift ui',
    
    // Data Science & AI
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'data analysis', 'big data',
    'apache spark', 'hadoop', 'kafka', 'airflow',
    
    // Testing
    'jest', 'mocha', 'chai', 'cypress', 'selenium', 'puppeteer', 'unit testing',
    'integration testing', 'e2e testing', 'tdd', 'bdd',
    
    // Version Control
    'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial',
    
    // Soft Skills
    'leadership', 'teamwork', 'communication', 'problem solving', 'project management',
    'agile', 'scrum', 'kanban', 'waterfall'
  ];
  
  const extractedSkills = [];
  const normalizedText = text.toLowerCase();
  
  for (const skill of skillKeywords) {
    if (normalizedText.includes(skill.toLowerCase())) {
      extractedSkills.push(skill);
    }
  }
  
  // Remove duplicates and return unique skills
  return [...new Set(extractedSkills)];
}

// Enhanced skill analysis with structured prompts
const generateSkillAnalysisPrompt = (skills, isResume = false) => {
  const basePrompt = `You are an expert career counselor and technical recruiter with 15+ years of experience in the Indian tech industry. Analyze the provided ${isResume ? 'resume content' : 'skills list'} and provide a comprehensive skill gap analysis with Indian market insights.

IMPORTANT: Return ONLY a valid JSON object with the exact structure below. Do not include any markdown formatting, explanations, or additional text.

{
  "overallScore": 75,
  "skillBreakdown": {
    "frontend": {
      "score": 80,
      "skills": ["React", "JavaScript", "CSS"],
      "missing": ["TypeScript", "Next.js", "Testing"],
      "priority": "High",
      "marketDemand": "Very High",
      "learningCurve": "Medium"
    },
    "backend": {
      "score": 45,
      "skills": ["Node.js"],
      "missing": ["Database Design", "API Architecture", "Microservices"],
      "priority": "High",
      "marketDemand": "High",
      "learningCurve": "Hard"
    },
    "devops": {
      "score": 20,
      "skills": [],
      "missing": ["Docker", "AWS", "CI/CD"],
      "priority": "Medium",
      "marketDemand": "High",
      "learningCurve": "Hard"
    },
    "softSkills": {
      "score": 70,
      "skills": ["Communication", "Problem Solving"],
      "missing": ["Leadership", "Project Management"],
      "priority": "Medium",
      "marketDemand": "High",
      "learningCurve": "Easy"
    },
    "mobile": {
      "score": 30,
      "skills": [],
      "missing": ["React Native", "Flutter", "iOS/Android"],
      "priority": "Low",
      "marketDemand": "Medium",
      "learningCurve": "Medium"
    },
    "dataScience": {
      "score": 25,
      "skills": [],
      "missing": ["Python", "Machine Learning", "Data Analysis"],
      "priority": "Low",
      "marketDemand": "Very High",
      "learningCurve": "Hard"
    }
  },
  "strengths": [
    {
      "skill": "React Development",
      "level": "Intermediate",
      "description": "Strong foundation in React with good understanding of components and state management",
      "marketValue": "High",
      "yearsExperience": "2-3 years"
    }
  ],
  "weaknesses": [
    {
      "skill": "Backend Development",
      "level": "Beginner",
      "description": "Limited experience with server-side technologies and database design",
      "impact": "High",
      "marketValue": "Very High",
      "urgency": "Immediate"
    }
  ],
  "recommendations": [
    {
      "skill": "TypeScript",
      "priority": "High",
      "reason": "Essential for modern React development and type safety. 85% of Indian companies now require TypeScript",
      "resources": [
        "TypeScript Handbook",
        "React with TypeScript course on Udemy",
        "Practice projects with TypeScript",
        "TypeScript Deep Dive by Basarat Ali Syed"
      ],
      "timeline": "2-3 months",
      "difficulty": "Medium",
      "marketValue": "Very High",
      "certification": "Microsoft TypeScript Certification",
      "projects": ["Build a TypeScript React app", "Convert existing JS project to TS"]
    }
  ],
  "careerPath": {
    "currentLevel": "Junior Developer",
    "targetLevel": "Mid-Level Developer",
    "timeToTarget": "6-12 months",
    "keyMilestones": [
      "Master TypeScript and modern React patterns",
      "Learn backend development with Node.js",
      "Understand database design and API development",
      "Build 2-3 full-stack projects",
      "Contribute to open source projects"
    ],
    "nextRoles": ["Senior Developer", "Tech Lead", "Full Stack Developer"],
    "skillGapsToClose": ["Backend Development", "System Design", "DevOps"]
  },
  "marketAnalysis": {
    "demandLevel": "Very High",
    "averageSalary": "₹6,00,000 - ₹12,00,000",
    "salaryRange": {
      "fresher": "₹3,00,000 - ₹5,00,000",
      "junior": "₹5,00,000 - ₹8,00,000",
      "mid": "₹8,00,000 - ₹15,00,000",
      "senior": "₹15,00,000 - ₹25,00,000"
    },
    "growthRate": "18% annually",
    "keySkillsInDemand": ["React", "TypeScript", "Node.js", "AWS", "Docker", "Python", "Machine Learning"],
    "topCompanies": ["TCS", "Infosys", "Wipro", "HCL", "Accenture", "Cognizant", "Capgemini", "Tech Mahindra"],
    "startupEcosystem": "Very Active",
    "remoteWorkPercentage": "65%",
    "jobOpenings": "15,000+ active openings"
  },
  "learningPath": {
    "immediate": [
      {
        "skill": "TypeScript",
        "duration": "1-2 months",
        "resources": ["Official docs", "Udemy course", "Practice projects"]
      }
    ],
    "shortTerm": [
      {
        "skill": "Node.js & Express",
        "duration": "2-3 months",
        "resources": ["Node.js docs", "Express tutorial", "Build APIs"]
      }
    ],
    "longTerm": [
      {
        "skill": "System Design",
        "duration": "6-12 months",
        "resources": ["Grokking System Design", "High Scalability", "Practice interviews"]
      }
    ]
  },
  "certifications": [
    {
      "name": "AWS Certified Developer",
      "provider": "Amazon",
      "relevance": "High",
      "cost": "₹15,000",
      "duration": "3-6 months"
    },
    {
      "name": "Microsoft Azure Developer",
      "provider": "Microsoft",
      "relevance": "High",
      "cost": "₹12,000",
      "duration": "2-4 months"
    }
  ],
  "interviewPrep": {
    "technicalRounds": 3,
    "commonTopics": ["Data Structures", "Algorithms", "System Design", "React Concepts"],
    "codingPlatforms": ["LeetCode", "HackerRank", "CodeChef", "GeeksforGeeks"],
    "mockInterviews": "Recommended",
    "portfolioProjects": "3-5 projects required"
  }
}

${isResume ? 'Resume Content:' : 'Skills List:'} ${skills}`;

  return basePrompt;
};

// Parse and validate JSON response from AI
const parseAIResponse = (response) => {
  try {
    // Try to extract JSON from the response
    let jsonStr = response;
    
    // Look for JSON within markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    // Look for JSON object in the response
    const objectMatch = response.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      jsonStr = objectMatch[0];
    }
    
    const parsed = JSON.parse(jsonStr);
    
    // Validate required fields and provide defaults
    return {
      overallScore: parsed.overallScore || 75,
      skillBreakdown: parsed.skillBreakdown || {},
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      recommendations: parsed.recommendations || [],
      careerPath: parsed.careerPath || {},
      marketAnalysis: parsed.marketAnalysis || {},
      learningPath: parsed.learningPath || {},
      certifications: parsed.certifications || [],
      interviewPrep: parsed.interviewPrep || {},
      rawResponse: response
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    // Return a fallback structure
    return {
      overallScore: 75,
      skillBreakdown: {},
      strengths: [],
      weaknesses: [],
      recommendations: [],
      careerPath: {},
      marketAnalysis: {},
      learningPath: {},
      certifications: [],
      interviewPrep: {},
      rawResponse: response,
      parseError: true
    };
  }
};

// Analyze skills from resume or manual input
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    const { skills } = req.body;
    let analysisResult;

    console.log('Skill gap analysis request:', { 
      hasFile: !!req.file, 
      hasSkills: !!skills, 
      skillsLength: skills ? skills.length : 0 
    });

    if (req.file) {
      // Extract text from uploaded resume file
      try {
        const resumeText = await extractTextFromFile(req.file);
        console.log('Extracted text length:', resumeText.length);
        
        // Extract skills using keyword matching
        const extractedSkills = extractSkillsFromText(resumeText);
        console.log('Extracted skills:', extractedSkills);
        
        // Generate comprehensive analysis prompt with actual resume content
        const prompt = generateSkillAnalysisPrompt(resumeText, true);
        const response = await generateResponse(prompt);
        
        if (response.demo) {
          // In demo mode, use mock response but include extracted skills
          analysisResult = {
            ...response.mockResponse,
            extractedSkills: extractedSkills,
            skillBreakdown: {
              ...response.mockResponse.skillBreakdown,
              extractedFromResume: {
                score: Math.min(90, 50 + extractedSkills.length * 3),
                skills: extractedSkills.slice(0, 10),
                missing: [],
                priority: 'High',
                marketDemand: 'High',
                learningCurve: 'Easy'
              }
            }
          };
        } else {
          analysisResult = parseAIResponse(response.data);
          // Add extracted skills to the result
          analysisResult.extractedSkills = extractedSkills;
        }
      } catch (fileError) {
        console.error('File processing error:', fileError);
        return res.status(400).json({ 
          error: 'Failed to process resume file',
          details: fileError.message
        });
      }
    } else if (skills && skills.trim()) {
      const prompt = generateSkillAnalysisPrompt(skills, false);
      const response = await generateResponse(prompt);
      
      if (response.demo) {
        analysisResult = response.mockResponse;
      } else {
        analysisResult = parseAIResponse(response.data);
      }
    } else {
      return res.status(400).json({ 
        error: 'Either skills or resume file is required',
        details: 'Please provide skills text or upload a resume file'
      });
    }
    
    // Persist event if possible
    try {
      await UserEvent.create({
        userId: tryGetUserId(req),
        type: 'skill_analysis',
        input: { skills: skills || '(resume)', enhanced: true },
        output: analysisResult,
      });
    } catch (error) {
      console.error('Error saving user event:', error);
    }

    res.json({
      success: true,
      analysis: analysisResult,
      isDemoMode: analysisResult.parseError || false,
      enhanced: true
    });
  } catch (error) {
    console.error('Skill gap analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze skills' });
  }
});

export default router;