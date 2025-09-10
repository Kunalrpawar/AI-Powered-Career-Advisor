import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardHome from './components/Dashboard/DashboardHome';
import SkillGapAnalyzer from './components/Features/SkillGapAnalyzer';
import CareerExplorer from './components/Features/CareerExplorer';
import AIMentorChat from './components/Features/AIMentorChat';
import ProjectGenerator from './components/Features/ProjectGenerator';
import JobMatcher from './components/Features/JobMatcher';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import InterviewAssist from './components/Features/InterviewAssist';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome setActiveSection={setActiveSection} />;
      case 'skillGap':
        return <SkillGapAnalyzer />;
      case 'career':
        return <CareerExplorer />;
      case 'chat':
        return <AIMentorChat />;
      case 'projects':
        return <ProjectGenerator />;
      case 'jobs':
        return <JobMatcher />;
      case 'interview':
        return <InterviewAssist />;
      default:
        return <DashboardHome setActiveSection={setActiveSection} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <Header />
        
        {/* Main Content Area */}
        <main className="min-h-[calc(100vh-4rem)]">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;