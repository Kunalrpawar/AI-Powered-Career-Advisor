import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Calendar,
  Sparkles,
  Star,
  Zap,
  TrendingUp,
  Award,
  Users,
  Target,
  Briefcase,
  Brain,
  Code,
  Rocket,
  Globe,
  Shield,
  Heart,
  Bot
} from 'lucide-react';

interface HomePageProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onRegisterClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeUsers, setActiveUsers] = useState(1289);
  const [statsCounter, setStatsCounter] = useState({ users: 45750, jobs: 23480, success: 94.7 });
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Smooth testimonial rotation
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    
    // Gentle time updates
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds instead of every second
    
    // Smooth active users simulation
    const usersInterval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 6) - 3; // Smaller changes -3 to +3
        return Math.max(1200, Math.min(1400, prev + change));
      });
    }, 8000); // Less frequent updates
    
    // Gentle statistics updates
    const statsInterval = setInterval(() => {
      setStatsCounter(prev => ({
        users: Math.min(50000, prev.users + Math.floor(Math.random() * 20)), // Smaller increments
        jobs: Math.min(25000, prev.jobs + Math.floor(Math.random() * 10)),
        success: Math.min(98, prev.success + Math.random() * 0.05)
      }));
    }, 10000); // Less frequent updates
    
    // Smooth feature rotation
    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 6);
    }, 4000);
    
    // Optimized mouse tracking with throttling
    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      }, 50); // Throttle mouse updates
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(slideInterval);
      clearInterval(timeInterval);
      clearInterval(usersInterval);
      clearInterval(statsInterval);
      clearInterval(featureInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(mouseTimeout);
    };
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Enable students to identify their best-fit career',
      description: 'with our world-class career assessment and personalised guidance.',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      delay: '0ms'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Empower students to learn all about the professional world',
      description: 'with virtual career simulations, exhaustive career library, career blogs and vlogs.',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      delay: '200ms'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Pave student\'s way to their dream college',
      description: 'with our end-to-end college application guidance, scholarship drive and corporate internship program.',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      delay: '400ms'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Enable schools in creating a career guidance ecosystem',
      description: 'in sync with the vision of New Education Policy',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      delay: '600ms'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Empower educators to become International Certified Career Coaches',
      description: 'and build a career in career guidance & counselling',
      bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      delay: '800ms'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Revolutionary assessment platform and technology driven career guidance solutions',
      description: 'for educators to boost their career guidance & counselling practice',
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      delay: '1000ms'
    }
  ];

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Notch Navigation Bar */}
      <nav className="fixed top-3 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-white/95 via-blue-50/95 to-white/95 backdrop-blur-xl rounded-full shadow-2xl border-2 border-gradient-to-r from-blue-200/50 via-purple-200/50 to-blue-200/50 px-12 py-2 transition-all duration-500 hover:shadow-3xl hover:scale-105 hover:from-blue-50/95 hover:via-purple-50/95 hover:to-blue-50/95 w-full max-w-screen-xl">
        <div className="flex justify-between items-center mx-auto">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 shadow-xl group-hover:shadow-2xl animate-pulse">
                  <Bot className="w-5 h-5 text-white transition-transform duration-500 group-hover:scale-110" />
                </div>
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-700 -z-10 animate-pulse"></div>
                {/* Multiple floating particles */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute top-1/2 -right-2 w-1 h-1 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-600" style={{animationDelay: '0.4s'}}></div>
              </div>
              <div className="transition-all duration-500 group-hover:translate-x-1 hidden sm:block">
                <h1 className="text-lg font-bold text-transparent bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-indigo-600 transition-all duration-500 leading-none animate-gradient-x">
                  AI Career Advisor
                </h1>
                <p className="text-sm text-gray-500 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-500 leading-none">
                  Your Career Companion
                </p>
              </div>
            </div>

            {/* Enhanced Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
              {[
                { href: '#features', label: 'Features', icon: '✨', color: 'from-blue-500 to-cyan-500' },
                { href: '#programs', label: 'Programs', icon: '🎯', color: 'from-purple-500 to-pink-500' },
                { href: '#how-it-works', label: 'How It Works', icon: '⚡', color: 'from-indigo-500 to-blue-500' }
              ].map((item, index) => (
                <a 
                  key={item.href}
                  href={item.href} 
                  className="group relative px-4 py-2 rounded-full text-gray-700 hover:text-white font-semibold text-sm transition-all duration-500 hover:shadow-lg overflow-hidden transform hover:scale-110"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 shadow-lg`}></div>
                  
                  {/* Icon and text */}
                  <span className="relative flex items-center space-x-2 z-10">
                    <span className="text-lg opacity-70 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 group-hover:animate-bounce">{item.icon}</span>
                    <span className="transform group-hover:translate-x-0.5 transition-transform duration-500">{item.label}</span>
                  </span>
                  
                  {/* Underline animation */}
                  <div className={`absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r ${item.color} group-hover:w-3/4 group-hover:left-1/8 transition-all duration-500 rounded-full`}></div>
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}></div>
                </a>
              ))}
            </div>

            {/* Enhanced Auth Buttons */}
            <div className="flex items-center space-x-3">
              {/* Sign In Button */}
              <button 
                onClick={onLoginClick}
                className="group relative px-6 py-2 text-gray-700 hover:text-white font-semibold text-sm transition-all duration-500 rounded-full overflow-hidden border-2 border-gray-300 hover:border-transparent transform hover:scale-110 hover:shadow-lg"
              >
                <span className="relative z-10 flex items-center space-x-2 transform group-hover:scale-105 transition-transform duration-500">
                  <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-bounce">👤</span>
                  <span>Sign In</span>
                </span>
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
              </button>
              
              {/* Get Started Button */}
              <button 
                onClick={onRegisterClick}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold text-sm hover:shadow-2xl transform hover:scale-110 transition-all duration-500 overflow-hidden animate-gradient-x bg-300%"
              >
                {/* Animated background layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Button content */}
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100 group-hover:animate-bounce">🚀</span>
                  <span className="transform group-hover:translate-x-0.5 transition-transform duration-500">Get Started</span>
                </span>
                
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
              </button>
              
              {/* Mobile menu button (enhanced) */}
              <button className="md:hidden group relative p-2 rounded-full hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all duration-500 border-2 border-transparent hover:border-blue-300 transform hover:scale-110">
                <div className="w-5 h-5 flex flex-col justify-center items-center space-y-1">
                  <div className="w-3 h-0.5 bg-gray-600 group-hover:bg-blue-600 transition-all duration-500 transform group-hover:rotate-45 group-hover:translate-y-1"></div>
                  <div className="w-3 h-0.5 bg-gray-600 group-hover:bg-purple-600 transition-all duration-500 group-hover:opacity-0"></div>
                  <div className="w-3 h-0.5 bg-gray-600 group-hover:bg-blue-600 transition-all duration-500 transform group-hover:-rotate-45 group-hover:-translate-y-1"></div>
                </div>
              </button>
            </div>
        </div>
        {/* Enhanced bottom border with animated gradient */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-full animate-pulse"></div>
        
        {/* Real-time activity indicator */}
        <div className="absolute -top-8 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-bounce shadow-lg">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span>{activeUsers.toLocaleString()} online now</span>
          </div>
        </div>
        
        {/* Live time display */}
        <div className="absolute -top-8 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          {currentTime.toLocaleTimeString()}
        </div>
        
        {/* Floating particles around navbar */}
        <div className="absolute -top-2 left-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-ping" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute -top-1 right-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-40 animate-ping" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute -bottom-2 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-25 animate-ping" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center">
        {/* Enhanced Background Elements with Parallax */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transition-all duration-1000 animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            }}
          ></div>
          <div 
            className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transition-all duration-1000 animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
              animationDelay: '1s'
            }}
          ></div>
          <div 
            className="absolute -bottom-8 left-40 w-96 h-96 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transition-all duration-1000 animate-pulse"
            style={{
              transform: `translate(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px)`,
              animationDelay: '2s'
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 transition-all duration-1000 animate-pulse"
            style={{
              transform: `translate(calc(-50% + ${mousePosition.x * -0.005}px), calc(-50% + ${mousePosition.y * -0.005}px))`,
              animationDelay: '0.5s'
            }}
          ></div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Simplified floating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full opacity-30 animate-bounce`}
              style={{
                backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'][i % 4],
                top: `${20 + (i * 10)}%`,
                left: `${15 + (i * 12)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + (i % 3)}s`,
              }}
            />
          ))}
          
          {/* Static elegant shapes */}
          <div className="absolute top-32 left-16 w-4 h-4 bg-blue-500 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute top-48 right-32 w-3 h-3 bg-purple-500 rounded-full animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-indigo-500 rounded-full animate-pulse opacity-40" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-500 rounded-full animate-pulse opacity-40" style={{animationDelay: '1.5s'}}></div>
          
          {/* Clean animated shapes */}
          <div className="absolute top-1/4 left-3/4 w-6 h-6 border-2 border-pink-400 rounded-full animate-spin opacity-30" style={{animationDuration: '10s'}}></div>
          <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-yellow-400 transform rotate-45 animate-pulse opacity-40"></div>
          <div className="absolute top-3/4 left-1/3 w-5 h-5 border-2 border-green-400 transform rotate-45 animate-bounce opacity-30" style={{animationDelay: '2s', animationDuration: '4s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex items-center">
          <div className="text-center w-full">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Enhanced Badge with Animation */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200 text-blue-800 text-sm font-medium mb-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
                <Sparkles className="w-4 h-4 mr-2 animate-spin" style={{animationDuration: '3s'}} />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  AI-Powered Career Guidance Platform
                </span>
                <div className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-bounce">
                  LIVE
                </div>
              </div>

              {/* Enhanced Title with Gradient Animation */}
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient bg-300% animate-gradient-x">
                  Perfect Career
                </span>
                <div className="relative inline-block">
                  <Heart className="w-12 h-12 text-red-500 absolute -top-6 -right-12 animate-pulse opacity-70" />
                </div>
              </h1>
              
              {/* Enhanced Description */}
              <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                Make smart career decisions with our 
                <span className="font-semibold text-blue-600">revolutionary AI-enabled</span> career guidance tools, 
                personalized mentorship, and comprehensive career development platform designed for the 
                <span className="font-semibold text-purple-600">modern professional</span>.
              </p>

              {/* Professional Illustration - Compact */}
              <div className="mb-6 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
                <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 xl:-mx-16 2xl:-mx-32">
                  <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                    <img 
                      src="/professionals-illustration.png" 
                      alt="Diverse professionals representing various career paths"
                      className="w-full h-auto max-h-32 md:max-h-40 lg:max-h-48 object-cover object-center transition-all duration-500 transform hover:scale-[1.02]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    {/* Enhanced Fallback */}
                    <div className="hidden justify-center items-center h-32 md:h-40 lg:h-48 bg-gradient-to-r from-blue-100 to-purple-100 w-full">
                      <div className="text-center text-gray-600">
                        <div className="text-4xl mb-2 animate-bounce">👥</div>
                        <p className="text-sm font-medium">Professional illustrations coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Services List */}
              <div className="mb-6 animate-fade-in-up" style={{animationDelay: '1.5s'}}>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="flex flex-wrap justify-center items-center gap-4 text-gray-700 text-sm font-medium">
                    {[
                      { name: 'Career Assessment', icon: '📊' },
                      { name: 'AI-Powered Guidance', icon: '🤖' },
                      { name: 'Skill Gap Analysis', icon: '📈' },
                      { name: 'Job Matching', icon: '💼' },
                      { name: 'Interview Prep', icon: '🎤' },
                      { name: 'Project Generator', icon: '🚀' }
                    ].map((service, index) => (
                      <div 
                        key={service.name}
                        className={`flex items-center gap-2 hover:scale-110 transition-transform duration-300 ${
                          index === currentFeature ? 'text-blue-600 font-bold transform scale-110' : ''
                        }`}
                      >
                        <span className="animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>
                          {service.icon}
                        </span>
                        <span>{service.name}</span>
                        {index === currentFeature && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping ml-1"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '1.8s'}}>
                <button 
                  onClick={onRegisterClick}
                  className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center">
                    <Rocket className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
                </button>
                
                <button 
                  onClick={onLoginClick}
                  className="group border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/80"
                >
                  <Zap className="w-5 h-5 mr-3 group-hover:text-yellow-500 group-hover:animate-pulse" />
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6 animate-bounce">
              <Lightbulb className="w-4 h-4 mr-2 animate-pulse" />
              Our Mission
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Shaping the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">Career Guidance</span> Landscape
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive career guidance solutions for students, parents, educators and schools 
              powered by cutting-edge AI technology and personalized approaches.
            </p>
          </div>

          {/* Enhanced Features Grid with Staggered Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group animate-fade-in-up"
                style={{animationDelay: feature.delay}}
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-transparent h-full transform hover:-translate-y-2">
                  {/* Enhanced Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Enhanced Icon */}
                    <div className="relative mb-8">
                      <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300 ${feature.bgColor} group-hover:rotate-3`}>
                        {feature.icon}
                      </div>
                      {/* Icon Glow */}
                      <div className={`absolute inset-0 w-24 h-24 mx-auto rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${feature.bgColor}`}></div>
                      
                      {/* Floating particles */}
                      <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute bottom-0 right-0 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.4s'}}></div>
                      <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" style={{animationDelay: '0.6s'}}></div>
                    </div>

                    {/* Enhanced Text Content */}
                    <p className="text-gray-800 text-sm leading-relaxed font-medium group-hover:text-gray-900 transition-colors duration-300">
                      <span className="font-bold text-base">{feature.title}</span> {feature.description}
                    </p>

                    {/* Enhanced Decorative Element */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-x-150"></div>
                    </div>
                    
                    {/* New: Hover overlay */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Programs Section */}
      <section id="programs" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Comprehensive Programs
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Personalized, expert services & support for all stakeholders in the career guidance process.
            </p>
          </div>

          {/* Target Audience Section */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Who We Serve</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Students */}
              <div className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white">👨‍🎓</span>
                    </div>
                  </div>
                  <div className="pt-8 text-center">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Students & Job Seekers</h4>
                    <p className="text-gray-600 leading-relaxed">
                      AI-powered career guidance, skill analysis, job matching, and interview preparation for career success.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Changers */}
              <div className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white">🔄</span>
                    </div>
                  </div>
                  <div className="pt-8 text-center">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Career Changers</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Personalized roadmaps, skill gap analysis, and project recommendations for successful career transitions.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professionals */}
              <div className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white">💼</span>
                    </div>
                  </div>
                  <div className="pt-8 text-center">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Working Professionals</h4>
                    <p className="text-gray-600 leading-relaxed">
                      Advanced skill development, career progression planning, and professional growth strategies.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="space-y-16">
            {/* AI-Powered Features */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">AI-Powered Career Tools</h3>
                  <p className="text-gray-600">Intelligent career guidance powered by advanced AI technology</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-white text-lg">💬</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">AI Career Mentor</h4>
                        <p className="text-sm text-gray-600">24/7 AI Chat Assistant</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Get instant career advice, interview tips, and personalized guidance from our AI mentor powered by Google Gemini.
                    </p>
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                      Try AI Mentor
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-white text-lg">📊</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Skill Gap Analysis</h4>
                        <p className="text-sm text-gray-600">Comprehensive Assessment</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Analyze your current skills, identify gaps, and get personalized recommendations to advance your career.
                    </p>
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                      Analyze Skills
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Development Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Matching & Projects */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Job Matching & Projects</h3>
                    <p className="text-gray-600 text-sm">Find opportunities & build portfolio</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Smart Job Matcher</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Upload your resume or enter skills to get matched with relevant job opportunities and generate personalized cover letters.
                    </p>
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                      Find Jobs
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Project Generator</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Get personalized project ideas based on your interests and skill level to build a strong portfolio.
                    </p>
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                      Generate Projects
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Interview & Assessment Tools */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Interview & Assessment</h3>
                    <p className="text-gray-600 text-sm">Prepare for success</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Interview Assistant</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      AI-powered interview preparation with practice questions, tips, and personalized feedback for technical and behavioral interviews.
                    </p>
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                      Practice Interview
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Aptitude Quiz</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      Comprehensive aptitude tests to assess your strengths and identify areas for improvement in various domains.
                    </p>
                    <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                      Take Quiz
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Additional Features</h3>
                  <p className="text-gray-600 text-sm">Complete career development ecosystem</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Career Explorer</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Discover career paths based on your interests and skills with detailed roadmaps and growth prospects.
                  </p>
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    Explore Careers
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Timeline Tracker</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Track your career milestones, set goals, and stay on top of important deadlines and opportunities.
                  </p>
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    Track Progress
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Colleges Directory</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Explore colleges and universities with detailed information, admission requirements, and course offerings.
                  </p>
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                    Browse Colleges
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Upload Resume or Enter Skills
              </h3>
              <p className="text-gray-600">
                Upload your resume for AI analysis or manually enter your skills and interests.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Get Personalized Analysis
              </h3>
              <p className="text-gray-600">
                Receive detailed skill gap analysis, career recommendations, and learning paths.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Find Jobs & Build Career
              </h3>
              <p className="text-gray-600">
                Discover relevant job opportunities and get guidance to achieve your career goals.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-30"></div>
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/4 left-3/4 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-30" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Enhanced Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 animate-fade-in-up">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-8 animate-bounce-in" style={{animationDelay: '0.5s'}}>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" style={{animationDuration: '3s'}} />
              <span className="font-bold">Start Your Journey Today</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in-up" style={{animationDelay: '0.7s'}}>
              Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">Transform</span> Your Career?
              <div className="relative inline-block ml-4">
                <Rocket className="w-12 h-12 text-blue-500 animate-bounce" />
              </div>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up" style={{animationDelay: '0.9s'}}>
              Join <span className="font-bold text-blue-600">thousands of professionals</span> who have already discovered their perfect career path 
              with our AI-powered platform. Your <span className="font-bold text-purple-600">dream career</span> is just one click away.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 animate-fade-in-up" style={{animationDelay: '1.1s'}}>
              <button 
                onClick={onRegisterClick}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-2xl text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden animate-shimmer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  <Heart className="w-6 h-6 mr-3 group-hover:animate-heartbeat text-red-300" />
                  Get Started Now
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 group-hover:animate-pulse"></div>
              </button>
              
              <button 
                onClick={onLoginClick}
                className="group border-2 border-gray-300 text-gray-700 px-12 py-6 rounded-2xl text-xl font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/90 hover:shadow-xl transform hover:scale-105"
              >
                <Calendar className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span>Sign In</span>
                <Sparkles className="w-4 h-4 ml-3 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-300" />
              </button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm animate-fade-in-up" style={{animationDelay: '1.3s'}}>
              <div className="flex items-center gap-2 hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                <span className="font-medium">Free to get started</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" style={{animationDelay: '0.5s'}} />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" style={{animationDelay: '1s'}} />
                <span className="font-medium">AI-powered insights</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-110 transition-transform duration-300">
                <Shield className="w-5 h-5 text-blue-500 animate-pulse" style={{animationDelay: '1.5s'}} />
                <span className="font-medium">Secure & Private</span>
              </div>
            </div>
            

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

