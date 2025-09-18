# 🚀 AI Career Advisor

A comprehensive AI-powered career guidance platform that helps users explore career paths, analyze skills, match with jobs, and generate personalized projects using Google's Gemini AI.

## ✨ Features

### 🤖 AI-Powered Features
- **AI Mentor Chat** - Interactive career guidance and advice
- **Career Path Explorer** - Discover personalized career opportunities
- **Job Matcher** - Match skills with job opportunities and generate cover letters
- **Project Generator** - Get personalized project ideas based on interests and skill level
- **Skill Gap Analyzer** - Analyze current skills and identify areas for improvement

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark/Light Theme** - Customizable interface
- **Interactive Dashboard** - Clean and intuitive user interface
- **Real-time Chat** - Smooth AI conversation experience

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Google Gemini AI** - AI language model
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
Hackgen/
├── 📁 src/                          # Frontend source code
│   ├── 📁 components/
│   │   ├── 📁 Dashboard/
│   │   │   └── DashboardHome.tsx    # Main dashboard component
│   │   ├── 📁 Features/             # Core feature components
│   │   │   ├── AIMentorChat.tsx     # AI chat interface
│   │   │   ├── CareerExplorer.tsx   # Career path exploration
│   │   │   ├── JobMatcher.tsx       # Job matching & cover letters
│   │   │   ├── ProjectGenerator.tsx # Project idea generation
│   │   │   └── SkillGapAnalyzer.tsx # Skills analysis
│   │   └── 📁 Layout/               # Layout components
│   │       ├── Header.tsx           # Navigation header
│   │       └── Sidebar.tsx          # Side navigation
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # App entry point
│   └── index.css                    # Global styles
├── 📁 server/                       # Backend source code
│   ├── 📁 config/
│   │   └── gemini.js                # Gemini AI configuration
│   ├── 📁 routes/                   # API route handlers
│   │   ├── career.js                # Career exploration endpoints
│   │   ├── chat.js                  # AI chat endpoints
│   │   ├── jobs.js                  # Job matching endpoints
│   │   ├── projects.js              # Project generation endpoints
│   │   └── skillGap.js              # Skills analysis endpoints
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

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For providing the AI capabilities
- **React Team** - For the amazing frontend framework
- **Express.js** - For the robust backend framework
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for career development and AI innovation**
