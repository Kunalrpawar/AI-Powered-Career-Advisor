import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import HomePage from './components/Features/HomePage';
import DashboardHome from './components/Dashboard/DashboardHome';
import SkillGapJobMatcher from './components/Features/SkillGapJobMatcher';
import AIMentorChat from './components/Features/AIMentorChat';
import ProjectGenerator from './components/Features/ProjectGenerator';
import JobMatcher from './components/Features/JobMatcher';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import InterviewAssist from './components/Features/InterviewAssist';
import AIAssistance from './components/Features/AIAssistance';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AptitudeQuiz from './components/Features/AptitudeQuiz';
import CourseMapping from './components/Features/CourseMapping';
import CollegesDirectory from './components/Features/CollegesDirectory';
import TimelineTracker from './components/Features/TimelineTracker';
import Profile from './components/Features/Profile';
import Recommendations from './components/Features/Recommendations';
import MentorPortal from './components/Features/MentorPortal';
import CareerResources from './components/Features/CareerResources';
import Scholarships from './components/Features/Scholarships';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block">
            <div className="bg-white/60 backdrop-blur rounded-2xl p-8 shadow border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold mb-4">HG</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hackgen Career OS</h1>
              <p className="text-gray-600 mb-6">Your AI-powered companion for skill growth, projects, interviews, and jobs.</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-2"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  <span>Analyze your skill gaps and get personalized roadmaps</span></li>
                <li className="flex items-center space-x-2"><span className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                  <span>Generate projects and prepare for interviews</span></li>
                <li className="flex items-center space-x-2"><span className="w-1.5 h-1.5 bg-pink-600 rounded-full" />
                  <span>Match with relevant jobs in real-time</span></li>
              </ul>
            </div>
          </div>
          <div>
            {showRegister ? (
              <Register onSwitchToLogin={() => setShowRegister(false)} />
            ) : (
              <Login onSwitchToRegister={() => setShowRegister(true)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <DashboardHome setActiveSection={setActiveSection} />;
      case 'skillGap':
        return <SkillGapJobMatcher />;
      case 'chat':
        return <AIMentorChat />;
      case 'projects':
        return <ProjectGenerator />;
      case 'jobs':
        return <JobMatcher />;
      case 'interview':
        return <AIAssistance />;
      case 'quiz':
        return <AptitudeQuiz />;
      case 'mapping':
        return <CourseMapping />;
      case 'colleges':
        return <CollegesDirectory />;
      case 'resources':
        return <CareerResources />;
      case 'scholarships':
        return <Scholarships />;
      case 'timeline':
        return <TimelineTracker />;
      case 'profile':
        return <Profile />;
      case 'recommendations':
        return <Recommendations />;
      case 'mentor':
        return <MentorPortal />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="ml-64 h-screen flex flex-col">
        <Header setActiveSection={setActiveSection} />
        <main className="flex-1 overflow-y-auto min-h-0">{renderActiveSection()}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;