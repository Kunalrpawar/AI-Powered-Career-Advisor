import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Calendar,
  Sparkles
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: '🧩',
      title: 'Enable students to identify their best-fit career',
      description: 'with our world-class career assessment and personalised guidance.',
      bgColor: 'bg-blue-500'
    },
    {
      icon: '💻',
      title: 'Empower students to learn all about the professional world',
      description: 'with virtual career simulations, exhaustive career library, career blogs and vlogs.',
      bgColor: 'bg-yellow-400'
    },
    {
      icon: '🎓',
      title: 'Pave student\'s way to their dream college',
      description: 'with our end-to-end college application guidance, scholarship drive and corporate internship program.',
      bgColor: 'bg-blue-300'
    },
    {
      icon: '🗺️',
      title: 'Enable schools in creating a career guidance ecosystem',
      description: 'in sync with the vision of New Education Policy',
      bgColor: 'bg-yellow-400'
    },
    {
      icon: '🏆',
      title: 'Empower educators to become International Certified Career Coaches',
      description: 'and build a career in career guidance & counselling',
      bgColor: 'bg-blue-300'
    },
    {
      icon: '🔍',
      title: 'Revolutionary assessment platform and technology driven career guidance solutions',
      description: 'for educators to boost their career guidance & counselling practice',
      bgColor: 'bg-blue-500'
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-40 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 left-40 w-96 h-96 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 left-16 w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-48 right-32 w-3 h-3 bg-purple-500 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-indigo-500 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-500 rounded-full animate-bounce opacity-60" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Enhanced Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-800 text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Career Guidance Platform
              </div>

              {/* Enhanced Title */}
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  Perfect Career
                </span>
              </h1>
              
              {/* Enhanced Description */}
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed font-light">
                Make smart career decisions with our revolutionary AI-enabled career guidance tools, 
                personalized mentorship, and comprehensive career development platform designed for the modern professional.
              </p>

              {/* Professional Illustration - Above Services */}
              <div className="mb-12 w-full -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="relative">
                  <img 
                    src="/professionals-illustration.png" 
                    alt="Diverse professionals representing various career paths"
                    className="w-full h-auto max-h-48 object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                  {/* Enhanced Fallback */}
                  <div className="hidden justify-center items-center h-48 bg-gradient-to-r from-blue-100 to-purple-100 w-full">
                    <div className="text-center text-gray-600">
                      <div className="text-8xl mb-4">👥</div>
                      <p className="text-lg font-medium">Professional illustrations coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Services List */}
              <div className="mb-20">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
                  <div className="flex flex-wrap justify-center items-center gap-6 text-gray-700 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Career Assessment</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>AI-Powered Guidance</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Skill Gap Analysis</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Job Matching</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Interview Prep</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Project Generator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4 mr-2" />
              Our Mission
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Shaping the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Career Guidance</span> Landscape
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive career guidance solutions for students, parents, educators and schools 
              powered by cutting-edge AI technology and personalized approaches.
            </p>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-transparent h-full">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="relative mb-8">
                      <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${feature.bgColor}`}>
                        {feature.icon}
                      </div>
                      {/* Icon Glow */}
                      <div className={`absolute inset-0 w-24 h-24 mx-auto rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${feature.bgColor}`}></div>
                    </div>

                    {/* Text Content */}
                    <p className="text-gray-800 text-sm leading-relaxed font-medium group-hover:text-gray-900 transition-colors duration-300">
                      {feature.title} {feature.description}
                    </p>

                    {/* Decorative Element */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Programs Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
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
      <section className="py-20 bg-white">
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
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Enhanced Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Journey Today
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transform</span> Your Career?
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Join thousands of professionals who have already discovered their perfect career path 
              with our AI-powered platform. Your dream career is just one click away.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-2xl text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  Start Your Journey Today
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              
              <button className="group border-2 border-gray-300 text-gray-700 px-12 py-6 rounded-2xl text-xl font-semibold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center backdrop-blur-sm bg-white/80">
                <Calendar className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Schedule a Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free to get started</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI-powered insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

