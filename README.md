# 🚀 AI Career Advisor

A comprehensive AI-powered career guidance platform that helps users explore career paths, analyze skills, match with jobs, and generate personalized projects using Google's Gemini AI.

## ✨ Features

### 🤖 AI-Powered Features
- **AI Mentor Chat** - Interactive career guidance and advice
- **Career Path Explorer** - Discover personalized career opportunities
- **Job Matcher** - Match skills with job opportunities and generate cover letters
- **Project Generator** - Get personalized project ideas based on interests and skill level
- **Skill Gap Analyzer** - Analyze current skills and identify areas for improvement
- **Interview Assistant** - AI-powered interview preparation and feedback
- **Aptitude Quiz** - Assess your skills and career fit
- **Course Recommendations** - Get customized learning paths

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark/Light Theme** - Customizable interface
- **Interactive Dashboard** - Clean and intuitive user interface
- **Real-time Chat** - Smooth AI conversation experience
- **Multi-language Support** - Internationalization with multiple languages
- **WebRTC Meetings** - Virtual career counseling sessions
- **Achievement Badges** - Gamified learning experience
- **Timeline Tracker** - Visual career development progress

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons
- **i18next** - Internationalization framework
- **WebRTC** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Google Gemini AI** - AI language model
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Vector Database** - Embedding storage for RAG
- **BM25** - Information retrieval algorithm

### ML Components
- **Python** - ML model training
- **Pandas** - Data preprocessing
- **Scikit-learn** - ML algorithms
- **Jupyter Notebooks** - Data analysis

### Development Tools
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **Docker** - Containerization
- **Vercel** - Deployment platform

## 📁 Project Structure

```
Hackgen/
├── 📁 src/                          # Frontend source code
│   ├── 📁 components/
│   │   ├── 📁 Auth/                 # Authentication components
│   │   │   ├── Login.tsx            # Login component
│   │   │   ├── Login_new.tsx        # New login implementation
│   │   │   └── Register.tsx         # Registration component
│   │   ├── 📁 Dashboard/
│   │   │   └── DashboardHome.tsx    # Main dashboard component
│   │   ├── 📁 Features/             # Core feature components
│   │   │   ├── AIAssistance.tsx     # AI assistance features
│   │   │   ├── AIMentorChat.tsx     # AI chat interface
│   │   │   ├── AptitudeQuiz.tsx     # Career aptitude testing
│   │   │   ├── CareerExplorer.tsx   # Career path exploration
│   │   │   ├── CareerResources.tsx  # Educational resources
│   │   │   ├── CollegesDirectory.tsx # College information
│   │   │   ├── CourseMapping.tsx    # Course recommendations
│   │   │   ├── HomePage.tsx         # Landing page
│   │   │   ├── InterviewAssist.tsx  # Interview preparation
│   │   │   ├── JobMatcher.tsx       # Job matching & cover letters
│   │   │   ├── MentorPortal.tsx     # Mentor access portal
│   │   │   ├── Profile.tsx          # User profile management
│   │   │   ├── ProjectGenerator.tsx # Project idea generation
│   │   │   ├── Recommendations.tsx  # Personalized recommendations
│   │   │   ├── Results.tsx          # Test results display
│   │   │   ├── Scholarships.tsx     # Scholarship information
│   │   │   ├── SkillGapAnalyzer.tsx # Skills analysis
│   │   │   ├── SkillGapJobMatcher.tsx # Job matching based on skills
│   │   │   ├── TimelineTracker.tsx  # Career development timeline
│   │   │   └── WebRTCMeeting.tsx    # Video meeting functionality
│   │   ├── 📁 Layout/               # Layout components
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   ├── LanguageSwitcher.tsx # Multilingual support
│   │   │   └── Sidebar.tsx          # Side navigation
│   │   └── 📁 UI/                   # UI components
│   │       └── BadgeNotification.tsx # Achievement notifications
│   ├── 📁 context/                  # React context providers
│   │   ├── AuthContext.tsx          # Authentication context
│   │   └── ThemeContext.tsx         # Theme management
│   ├── 📁 services/                 # Service modules
│   │   └── badgeService.ts          # Badge management
│   ├── 📁 types/                    # TypeScript type definitions
│   ├── 📁 utils/                    # Utility functions
│   │   ├── markdown.ts              # Markdown processing
│   │   └── mlCareerModel.ts         # ML model integration
│   ├── App.tsx                      # Main app component
│   ├── i18n.ts                      # Internationalization setup
│   ├── main.tsx                     # App entry point
│   └── index.css                    # Global styles
├── 📁 server/                       # Backend source code
│   ├── 📁 config/
│   │   └── gemini.js                # Gemini AI configuration
│   ├── 📁 mentor/                   # AI mentoring functionality
│   │   ├── orchestrator.js          # AI workflow management
│   │   ├── routerLLM.js             # LLM routing logic
│   │   └── 📁 tools/                # AI tool modules
│   │       ├── interestProfiler.js  # Interest assessment
│   │       ├── jobTargeter.js       # Job matching
│   │       ├── resources.js         # Learning resources
│   │       ├── resumeGrader.js      # Resume evaluation
│   │       └── roadmap.js           # Career roadmaps
│   ├── 📁 rag/                      # Retrieval Augmented Generation
│   │   ├── bm25.js                  # BM25 retrieval algorithm
│   │   ├── embeddingStore.js        # Vector embeddings management
│   │   ├── simpleRetriever.js       # Knowledge retrieval system
│   │   └── 📁 knowledge/            # Knowledge bases
│   │       └── career_counseling.json # Career guidance data
│   ├── 📁 routes/                   # API route handlers
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── badges.js                # Achievement system
│   │   ├── career.js                # Career exploration endpoints
│   │   ├── chat.js                  # AI chat endpoints
│   │   ├── colleges.js              # Educational institutions
│   │   ├── dashboard.js             # User dashboard data
│   │   ├── documents.js             # Document management
│   │   ├── enhanced_dashboard.js    # Advanced analytics
│   │   ├── interview.js             # Interview preparation
│   │   ├── jobs.js                  # Job matching endpoints
│   │   ├── profile.js               # User profile management
│   │   ├── projects.js              # Project generation endpoints
│   │   └── skillGap.js              # Skills analysis endpoints
│   ├── 📁 schema/                   # Database models
│   │   ├── AIChat.js                # Chat history model
│   │   ├── AptitudeTest.js          # Skills assessment
│   │   ├── CareerMapping.js         # Career path data
│   │   ├── CareerResource.js        # Learning resources
│   │   ├── CollegeInteraction.js    # College engagement
│   │   ├── Document.js              # User documents
│   │   ├── MentorSession.js         # Mentoring sessions
│   │   ├── ScholarshipInteraction.js # Scholarship engagement
│   │   ├── User.js                  # User account model
│   │   ├── UserEvent.js             # Activity tracking
│   │   └── UserProfile.js           # Extended user data
│   └── index.js                     # Server entry point
├── 📄 package.json                  # Dependencies and scripts
├── 📄 vite.config.ts                # Vite configuration
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
└── 📄 .env                          # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hackgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the frontend (Vite) and backend (Express) servers concurrently.

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend (Vite)
- `npm run server` - Start only the backend (Express)
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality

## 🔧 API Endpoints

### Chat API
- `POST /api/chat/message` - Send message to AI mentor

### Career API
- `POST /api/career/explore` - Explore career paths based on interests and skills

### Jobs API
- `POST /api/jobs/match` - Match skills with job opportunities
- `POST /api/jobs/cover-letter` - Generate personalized cover letters

### Projects API
- `POST /api/projects/generate` - Generate project ideas based on interests and difficulty

### Skills API
- `POST /api/skill-gap/analyze` - Analyze skills and identify gaps

### Authentication API
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User authentication
- `GET /api/auth/verify` - Verify user token

### Profile API
- `GET /api/profile` - Get user profile data
- `PUT /api/profile` - Update user profile

### Badges API
- `GET /api/badges` - Get user achievement badges
- `POST /api/badges/award` - Award new badge to user

### Colleges API
- `GET /api/colleges` - Get college recommendations
- `GET /api/colleges/:id` - Get detailed college information

### Documents API
- `POST /api/documents/upload` - Upload resume or other documents
- `GET /api/documents` - Retrieve user documents

### Interview API
- `POST /api/interview/prepare` - Get interview preparation materials
- `POST /api/interview/feedback` - Receive AI feedback on responses

### Dashboard API
- `GET /api/dashboard` - Get user dashboard data
- `GET /api/enhanced_dashboard` - Get expanded dashboard with analytics

### Health Check
- `GET /api/health` - Check server status and AI configuration

## 🎯 Usage

### 1. AI Mentor Chat
- Ask career-related questions
- Get personalized advice and guidance
- Receive interview tips and skill recommendations

### 2. Career Explorer
- Input your interests and current skills
- Discover relevant career paths
- View salary ranges and growth prospects
- Get learning roadmaps

### 3. Job Matcher
- Upload your resume or input skills manually
- Get matched with relevant job opportunities
- Generate personalized cover letters
- View fit percentages and explanations

### 4. Project Generator
- Specify your interests and skill level
- Get personalized project ideas
- View technologies needed and time estimates
- Access learning outcomes and starter code

### 5. Skill Gap Analyzer
- Analyze your current skills
- Identify areas for improvement
- Get personalized learning recommendations
- Track your overall skill score

### 6. Interview Assistant
- Practice for job interviews with AI
- Get feedback on your answers
- Learn industry-specific questions
- Improve your interview confidence

### 7. Educational Resources
- Access career-specific learning materials
- Find scholarships and financial aid
- Browse college and university programs
- Get personalized course recommendations

### 8. Multi-language Support
- Switch between multiple languages (English, Hindi, Urdu, and more)
- Accessibility for diverse user groups
- Localized content and recommendations

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `DATABASE_URL` | Database connection string | Yes |
| `JWT_SECRET` | Secret for JWT authentication | Yes |
| `CORS_ORIGIN` | Allowed CORS origins | No |
| `UPLOAD_DIR` | Directory for file uploads | No |
| `VECTOR_DB_URL` | Vector database connection | No |
| `ML_MODEL_PATH` | Path to ML models | No |

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```
The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Backend Deployment
The server can be deployed to any Node.js hosting platform. Make sure to set the environment variables in your hosting environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## � Machine Learning Components

The application integrates machine learning models for career prediction:

- **Data Processing**: Python scripts for data preparation (`run_ml_preprocessing.py`)
- **Model Training**: Jupyter notebook for model development (`ml_data_preprocessing.ipynb`)
- **Prediction Model**: Pre-trained model (`career_prediction_model.pkl`) for skill-to-career mapping
- **Datasets**: 
  - `career_path_cleaned.csv` - Processed career path data
  - `skill_career_cleaned.csv` - Skill to career mapping data
  - `career_path_in_all_field.csv` - Comprehensive career field data

Analysis results and visualizations are available in the project documentation.

## �📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Internationalization

The application supports multiple languages:
- English (en)
- Hindi (hi)
- Urdu (ur) 
- Kashmiri (ks)
- Dogri (do)

Translation files are managed in the `locales` directory using i18next.

## 🙏 Acknowledgments

- **Google Gemini AI** - For providing the AI capabilities
- **React Team** - For the amazing frontend framework
- **Express.js** - For the robust backend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **i18next** - For internationalization support
- **WebRTC** - For real-time communication capabilities
- **ML Contributors** - For career prediction models

## 📞 Support

If you have any questions or need help, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for career development and AI innovation**
