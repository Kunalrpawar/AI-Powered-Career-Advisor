import React, { useState } from 'react';
import { Lightbulb, Zap, Code, Clock, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProjectGenerator: React.FC = () => {
  const [interest, setInterest] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const interestAreas = [
    'Web Development', 'Mobile Apps', 'AI/Machine Learning', 'Data Science',
    'Cybersecurity', 'Game Development', 'Blockchain', 'IoT', 'DevOps', 'UI/UX Design'
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'green', description: '1-2 weeks' },
    { value: 'intermediate', label: 'Intermediate', color: 'yellow', description: '2-4 weeks' },
    { value: 'advanced', label: 'Advanced', color: 'red', description: '1-3 months' },
  ];

  // Curated ideas per interest and difficulty
  const curated: Record<string, { beginner: string[]; intermediate: string[]; advanced: string[] }> = {
    'Web Development': {
      beginner: [
        'Personal portfolio website',
        'Blog platform with Markdown support',
        'Weather app using an external API',
        'To-do list app with local storage',
        'Basic e-commerce product catalog (static)'
      ],
      intermediate: [
        'Event booking system with payments (Razorpay/Stripe)',
        'Job board with filtering/search',
        'Recipe sharing platform with user login',
        'Forum/community site with upvotes',
        'URL shortener service'
      ],
      advanced: [
        'Real-time chat app with WebSockets',
        'SaaS invoicing tool with subscription billing',
        'Multi-vendor e-commerce marketplace',
        'Learning Management System (LMS)',
        'Headless CMS with API + dashboard'
      ]
    },
    'Mobile Apps': {
      beginner: [
        'Notes-taking app (offline)',
        'BMI calculator app',
        'Expense tracker',
        'Flashcards for study',
        'Daily habits tracker'
      ],
      intermediate: [
        'Fitness app with workout plans',
        'Meditation & breathing app with sound',
        'Location-based reminder app',
        'Recipe app with meal planner',
        'Travel itinerary planner'
      ],
      advanced: [
        'On-demand food delivery app clone',
        'Ride-sharing app (Uber-like) with maps',
        'Social media mini-clone (posts, likes, chat)',
        'Healthcare consultation app (video + chat)',
        'AR-based interior design app'
      ]
    },
    'AI/Machine Learning': {
      beginner: [
        'House price prediction (linear regression)',
        'Spam vs. not spam email classifier',
        'Movie recommendation system (collaborative filtering)',
        'Handwritten digit recognition (MNIST)',
        'Sentiment analysis of tweets'
      ],
      intermediate: [
        'Chatbot for FAQs using NLP',
        'Fake news detection with ML',
        'Image classifier (cats vs dogs)',
        'Resume screening tool',
        'Music genre classifier'
      ],
      advanced: [
        'AI interviewer with speech-to-text + sentiment analysis',
        'Stock price prediction using deep learning',
        'Face recognition attendance system',
        'Generative AI image style transfer',
        'Personalized voice cloning'
      ]
    },
    'Data Science': {
      beginner: [
        'Sales dashboard using Excel/Power BI',
        'Netflix dataset analysis',
        'COVID-19 data visualization',
        'Stock trends visualization with Matplotlib',
        'Weather pattern analysis'
      ],
      intermediate: [
        'Customer segmentation with clustering',
        'Predict student exam performance',
        'Airbnb data analysis',
        'Crime rate analysis by city',
        'Social media engagement analysis'
      ],
      advanced: [
        'Predictive healthcare analytics',
        'Credit card fraud detection',
        'Real-time traffic prediction',
        'Recommendation engine (hybrid)',
        'Retail demand forecasting'
      ]
    },
    'Cybersecurity': {
      beginner: [
        'Password strength checker',
        'Secure file encryption/decryption tool',
        'Port scanner',
        'Keylogger detector',
        'Basic firewall rules setup'
      ],
      intermediate: [
        'Web vulnerability scanner (SQLi, XSS)',
        'Secure login system with JWT',
        'Phishing website detector',
        'Network packet sniffer',
        'Two-factor authentication system'
      ],
      advanced: [
        'Blockchain-based secure voting system',
        'Intrusion detection system (IDS)',
        'Malware sandbox analysis tool',
        'Ransomware simulation + defense model',
        'AI-driven anomaly detection in logs'
      ]
    },
    'Game Development': {
      beginner: [
        'Tic-tac-toe',
        'Snake game',
        'Flappy bird clone',
        'Memory card game',
        'Hangman'
      ],
      intermediate: [
        'Platformer game (like Mario)',
        'Chess with AI opponent',
        'Car racing game',
        'Tower defense game',
        '3D maze explorer'
      ],
      advanced: [
        'MMORPG prototype',
        'Multiplayer FPS with lobby',
        'VR escape room',
        'AI-driven NPC interaction system',
        'Physics-based puzzle game'
      ]
    },
    'Blockchain': {
      beginner: [
        'Cryptocurrency wallet UI mockup',
        'Blockchain visualizer (learn how blocks link)',
        'Simple smart contract for Hello World',
        'Token faucet (testnet)',
        'Basic NFT metadata generator'
      ],
      intermediate: [
        'Decentralized voting app',
        'Supply chain tracking with blockchain',
        'Crowdfunding DApp (Ethereum)',
        'NFT marketplace prototype',
        'Decentralized file storage system'
      ],
      advanced: [
        'Layer-2 payment channel implementation',
        'DAO (Decentralized Autonomous Organization)',
        'Blockchain-based healthcare record sharing',
        'Cross-chain token bridge',
        'Blockchain identity verification system'
      ]
    },
    'IoT': {
      beginner: [
        'Smart LED control with Arduino',
        'Temperature + humidity monitoring',
        'Motion detector alarm',
        'Smart door lock with RFID',
        'Plant watering system'
      ],
      intermediate: [
        'IoT home automation dashboard',
        'Smart parking system',
        'Health monitoring wearable prototype',
        'Smart garbage bin (alerts when full)',
        'Air quality monitoring'
      ],
      advanced: [
        'Smart city traffic light system',
        'Industrial IoT predictive maintenance',
        'Drone-based delivery system',
        'IoT-based disaster alert system',
        'Energy consumption optimization in smart homes'
      ]
    },
    'DevOps': {
      beginner: [
        'Dockerize a simple app',
        'Basic CI/CD with GitHub Actions',
        'Deploy static website on AWS/GCP/Azure',
        'Monitor app logs with Prometheus + Grafana',
        'Automated backup script'
      ],
      intermediate: [
        'Kubernetes cluster setup for microservices',
        'Terraform project for cloud infrastructure',
        'Jenkins pipeline for testing & deployment',
        'Serverless deployment with AWS Lambda',
        'Load balancer setup with Nginx'
      ],
      advanced: [
        'Chaos engineering experiment setup',
        'Multi-cloud deployment strategy',
        'Automated security scans in CI/CD',
        'GitOps with ArgoCD',
        'Scalable event-driven architecture with Kafka'
      ]
    },
    'UI/UX Design': {
      beginner: [
        'Redesign a login/signup page',
        'Portfolio website with animations',
        'Mobile app splash + onboarding screens',
        'E-commerce product page UI',
        'Landing page for a SaaS product'
      ],
      intermediate: [
        'Dashboard UI kit',
        'Design system + component library',
        'Wireframes for a social media app',
        'Dark mode toggle + accessibility improvements',
        'Interactive prototype in Figma/Adobe XD'
      ],
      advanced: [
        'AR/VR immersive UI experience',
        'AI-driven personalized UI themes',
        'UX research + case study (real users)',
        'Advanced micro-interactions for mobile',
        'Full redesign of an existing product (case study)'
      ]
    }
  };

  const estimatedByLevel: Record<string, string> = {
    beginner: '1-2 weeks',
    intermediate: '2-4 weeks',
    advanced: '1-3 months'
  };

  const generateProjects = async () => {
    if (!interest || !difficulty) {
      setError('Please select an interest area and difficulty level.');
      return;
    }
    setIsGenerating(true);
    try {
      setError(null);
      const group = curated[interest];
      if (group && (group as any)[difficulty]) {
        const titles: string[] = (group as any)[difficulty];
        const normalized = titles.map((title) => ({
          title,
          difficulty,
          description: 'Curated idea for your selected area and difficulty.',
          technologies: [],
          estimatedTime: estimatedByLevel[difficulty] || '2-4 weeks',
          learningOutcomes: []
        }));
        setProjects(normalized);
        return;
      }
      const response = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ interest, difficulty }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to generate projects');
      }

      const result = await response.json();

      // Normalize projects array
      let list = Array.isArray(result?.projects) ? result.projects : [];
      if (!Array.isArray(list) || list.length === 0) {
        // As a safety net, produce minimal demos client-side
        list = [
          {
            title: 'Personal Portfolio Website',
            difficulty: 'beginner',
            description: 'Create a responsive portfolio website to showcase your skills, projects, and experience. Include sections for about, projects, skills, and contact information.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
            estimatedTime: '2-3 days',
            learningOutcomes: [
              'HTML semantics and structure',
              'CSS Grid and Flexbox',
              'JavaScript DOM manipulation',
              'Responsive design principles'
            ],
            starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <!-- Your content here -->
    </main>
</body>
</html>`
          },
          {
            title: 'Weather Dashboard App',
            difficulty: 'intermediate',
            description: 'Build a weather dashboard that fetches data from a weather API and displays current conditions, forecasts, and allows users to search for different cities.',
            technologies: ['React', 'API Integration', 'CSS Modules', 'Local Storage'],
            estimatedTime: '1-2 weeks',
            learningOutcomes: [
              'React hooks and state management',
              'API integration and error handling',
              'Data visualization with charts',
              'Local storage for user preferences'
            ],
            starterCode: `import React, { useState, useEffect } from 'react';

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('London');

  useEffect(() => {
    // Fetch weather data
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (cityName) => {
    // API call implementation
  };

  return (
    <div className="weather-app">
      {/* Your weather dashboard UI */}
    </div>
  );
}

export default WeatherApp;`
          },
          {
            title: 'Task Management System',
            difficulty: 'advanced',
            description: 'Create a full-stack task management application with user authentication, real-time updates, project organization, and team collaboration features.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'JWT Authentication'],
            estimatedTime: '4-6 weeks',
            learningOutcomes: [
              'Full-stack application architecture',
              'User authentication and authorization',
              'Real-time communication with WebSockets',
              'Database design and optimization',
              'API design and testing'
            ],
            starterCode: `// Server setup (server.js)
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const socketio = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socketio(server);

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000);`
          }
        ];
      }

      setProjects(list);
    } catch (error: any) {
      console.error('Project generation failed:', error);
      setError(error?.message || 'Failed to generate projects');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Project & Hackathon Generator</h2>
            <p className="text-gray-500 dark:text-gray-400">Get AI-powered project ideas to build your portfolio</p>
          </div>
        </div>

        {/* Interest Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Choose Your Interest Area</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {interestAreas.map((area) => (
              <button
                key={area}
                onClick={() => setInterest(area)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  interest === area
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-2 border-orange-200 dark:border-orange-800'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Difficulty Level</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setDifficulty(level.value)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  difficulty === level.value
                    ? `bg-${level.color}-100 border-2 border-${level.color}-200`
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    difficulty === level.value 
                      ? `text-${level.color}-700` 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {level.label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    difficulty === level.value
                      ? `bg-${level.color}-200 text-${level.color}-700`
                      : 'bg-gray-200 text-gray-600 dark:text-gray-300'
                  }`}>
                    {level.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>
        )}

        <button
          onClick={generateProjects}
          disabled={isGenerating || !interest || !difficulty}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Generating Projects...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Generate Project Ideas</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Projects */}
      {projects.length > 0 && (
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getDifficultyColor(project.difficulty)}-100 text-${getDifficultyColor(project.difficulty)}-700`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Technologies */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies && project.technologies.map((tech: string, techIndex: number) => (
                      <span key={techIndex} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estimated Time */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Estimated Time
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">{project.estimatedTime}</p>
                </div>
              </div>

              {/* Learning Outcomes */}
              {project.learningOutcomes && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Learning Outcomes
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                    {project.learningOutcomes.map((outcome: string, outcomeIndex: number) => (
                      <li key={outcomeIndex} className="text-sm">{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Starter Code */}
              {project.starterCode && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Starter Code</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{project.starterCode}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectGenerator;