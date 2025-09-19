// @ts-nocheck
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { badgeService } from '../../services/badgeService';
import { mlCareerModel, type MLAnalysisResult, type StudentProfile } from '../../utils/mlCareerModel';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Mock data - In a real application, this would come from props or API
const mockResults = {
  studentClass: '10' as '10' | '12',
  aptitudeScore: 8,
  careerScores: {
    I: 15, // Investigative (Science)
    A: 8,  // Artistic (Arts)
    S: 12, // Social (Commerce/Humanities)
    E: 6,  // Enterprising (Business)
    R: 9   // Realistic (Technical)
  }
};

type CareerCategory = {
  code: 'I' | 'A' | 'S' | 'E' | 'R';
  name: string;
  description: string;
  color: string;
  streamName: string;
};

const CAREER_CATEGORIES: CareerCategory[] = [
  {
    code: 'I',
    name: 'Science Aptitude',
    description: 'Science, Medicine, Research, Engineering',
    color: '#3B82F6',
    streamName: 'Science Stream'
  },
  {
    code: 'A',
    name: 'Creative Aptitude',
    description: 'Arts, Design, Literature, Media',
    color: '#8B5CF6',
    streamName: 'Arts/Humanities'
  },
  {
    code: 'S',
    name: 'Social Aptitude',
    description: 'Teaching, Healthcare, Social Work',
    color: '#10B981',
    streamName: 'Commerce/Humanities'
  },
  {
    code: 'E',
    name: 'Business Aptitude',
    description: 'Business, Management, Law',
    color: '#F59E0B',
    streamName: 'Commerce Stream'
  },
  {
    code: 'R',
    name: 'Technical Aptitude',
    description: 'Engineering, Sports, Technical trades',
    color: '#EF4444',
    streamName: 'Science/Commerce'
  }
];

// Course recommendations for Class 12 students
const COURSE_RECOMMENDATIONS = {
  I: [
    { name: 'Computer Science Engineering', probability: 92, icon: '💻' },
    { name: 'Biotechnology', probability: 88, icon: '🧬' },
    { name: 'Medicine (MBBS)', probability: 85, icon: '⚕️' },
    { name: 'Data Science', probability: 89, icon: '📊' },
    { name: 'Artificial Intelligence', probability: 91, icon: '🤖' }
  ],
  A: [
    { name: 'Fine Arts', probability: 87, icon: '🎨' },
    { name: 'Graphic Design', probability: 84, icon: '🎨' },
    { name: 'Architecture', probability: 82, icon: '🏗️' },
    { name: 'Mass Communication', probability: 85, icon: '📺' },
    { name: 'Fashion Design', probability: 80, icon: '👗' }
  ],
  S: [
    { name: 'Psychology', probability: 88, icon: '🧠' },
    { name: 'Social Work', probability: 85, icon: '🤝' },
    { name: 'Education', probability: 83, icon: '📚' },
    { name: 'Nursing', probability: 86, icon: '🏥' },
    { name: 'Human Resources', probability: 81, icon: '👥' }
  ],
  E: [
    { name: 'Business Administration', probability: 90, icon: '💼' },
    { name: 'Law', probability: 87, icon: '⚖️' },
    { name: 'Economics', probability: 85, icon: '📈' },
    { name: 'Entrepreneurship', probability: 88, icon: '🚀' },
    { name: 'Finance', probability: 86, icon: '💰' }
  ],
  R: [
    { name: 'Mechanical Engineering', probability: 89, icon: '⚙️' },
    { name: 'Sports Science', probability: 83, icon: '🏃' },
    { name: 'Electrical Engineering', probability: 87, icon: '⚡' },
    { name: 'Civil Engineering', probability: 85, icon: '🏗️' },
    { name: 'Automotive Engineering', probability: 84, icon: '🚗' }
  ]
};

interface ResultsProps {
  studentClass?: '10' | '12';
  aptitudeScore?: number;
  careerScores?: {
    I: number;
    A: number;
    S: number;
    E: number;
    R: number;
  };
  onRetakeQuiz?: () => void;
  onBadgeEarned?: (badge: any) => void;
}

const Results: React.FC<ResultsProps> = (props) => {
  const {
    studentClass = mockResults.studentClass,
    aptitudeScore = mockResults.aptitudeScore,
    careerScores = mockResults.careerScores,
    onRetakeQuiz,
    onBadgeEarned
  } = props;
  const { t } = useTranslation();
  const [mlResults, setMLResults] = useState<MLAnalysisResult | null>(null);
  const [isLoadingML, setIsLoadingML] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Trigger ML analysis
  useEffect(() => {
    const runMLAnalysis = async () => {
      if (!aptitudeScore || !careerScores || !studentClass) return;
      
      setIsLoadingML(true);
      try {
        const studentProfile: StudentProfile = {
          class: studentClass,
          aptitudeScore,
          careerScores
        };
        
        console.log('🤖 Running ML career analysis...');
        const results = await mlCareerModel.predictCareer(studentProfile);
        setMLResults(results);
        console.log('✅ ML Analysis completed:', results);
      } catch (error) {
        console.error('❌ ML Analysis failed:', error);
      } finally {
        setIsLoadingML(false);
      }
    };

    runMLAnalysis();
  }, [aptitudeScore, careerScores, studentClass]);

  // Trigger aptitude badge when results are shown
  useEffect(() => {
    const triggerAptitudeBadge = async () => {
      try {
        const result = await badgeService.triggerAptitudeBadge();
        if (result?.isNewBadge && result.badge && onBadgeEarned) {
          onBadgeEarned(result.badge);
        }
      } catch (error) {
        console.error('Failed to trigger aptitude badge:', error);
      }
    };
    
    triggerAptitudeBadge();
  }, []); // Run once when component mounts

  // Calculate stream percentages for Class 10 students
  const calculateStreamPercentages = () => {
    const total = Object.values(careerScores).reduce((sum, score) => sum + score, 0);
    
    return [
      {
        name: 'Science',
        value: Math.round(((careerScores.I + careerScores.R * 0.5) / total) * 100),
        color: '#3B82F6',
        subjects: ['Physics', 'Chemistry', 'Mathematics/Biology'],
        description: 'Perfect for analytical minds who love problem-solving'
      },
      {
        name: 'Commerce',
        value: Math.round(((careerScores.E + careerScores.S * 0.3) / total) * 100),
        color: '#F59E0B',
        subjects: ['Accountancy', 'Business Studies', 'Economics'],
        description: 'Ideal for business-minded and leadership-oriented students'
      },
      {
        name: 'Arts/Humanities',
        value: Math.round(((careerScores.A + careerScores.S * 0.7) / total) * 100),
        color: '#8B5CF6',
        subjects: ['History', 'Political Science', 'Psychology', 'Literature'],
        description: 'Great for creative and socially conscious individuals'
      }
    ].sort((a, b) => b.value - a.value);
  };

  // Get top career matches
  const getTopCareerMatches = () => {
    return Object.entries(careerScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([code, score]) => {
        const category = CAREER_CATEGORIES.find(cat => cat.code === code)!;
        const percentage = Math.round((score / 30) * 100);
        return { ...category, score, percentage };
      });
  };

  // Prepare radar chart data
  const radarData = CAREER_CATEGORIES.map(category => ({
    category: category.name.replace(' Aptitude', ''),
    score: careerScores[category.code],
    fullMark: 30
  }));

  // Prepare bar chart data
  const barData = CAREER_CATEGORIES.map(category => ({
    name: category.name.replace(' Aptitude', ''),
    score: careerScores[category.code],
    color: category.color
  }));

  // Get course recommendations for Class 12
  const getCourseRecommendations = () => {
    const topMatches = getTopCareerMatches();
    const recommendations: any[] = [];
    
    topMatches.forEach(match => {
      const courses = COURSE_RECOMMENDATIONS[match.code] || [];
      courses.forEach(course => {
        recommendations.push({
          ...course,
          category: match.name,
          categoryColor: match.color
        });
      });
    });
    
    return recommendations.sort((a, b) => b.probability - a.probability).slice(0, 8);
  };

  const streamData = studentClass === '10' ? calculateStreamPercentages() : [];
  const topMatches = getTopCareerMatches();
  const courseRecommendations = studentClass === '12' ? getCourseRecommendations() : [];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Score: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // PDF Download Function
  const downloadPDF = async () => {
    if (!resultsRef.current) return;

    try {
      // Show loading state
      const downloadBtn = document.querySelector('.download-btn');
      if (downloadBtn) {
        downloadBtn.innerHTML = `
          <div class="flex items-center justify-center space-x-2">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating PDF...</span>
          </div>
        `;
        downloadBtn.classList.add('opacity-75', 'cursor-not-allowed');
      }

      // Simple approach: Create a basic PDF with text content
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Career Assessment Results', 105, 20, { align: 'center' });
      
      // Add basic information
      doc.setFontSize(12);
      doc.text(`Class: ${studentClass}`, 20, 35);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Add cognitive score
      doc.setFontSize(16);
      doc.text('Cognitive Score', 20, 60);
      doc.setFontSize(14);
      doc.text(`${aptitudeScore}/10 (${aptitudeScore >= 8 ? 'Excellent' : aptitudeScore >= 6 ? 'Above Average' : aptitudeScore >= 4 ? 'Average' : 'Needs Improvement'})`, 20, 70);
      
      // Add top matches
      doc.setFontSize(16);
      doc.text('Top Career Matches', 20, 90);
      doc.setFontSize(14);
      
      let yPos = 100;
      const topMatches = getTopCareerMatches();
      topMatches.forEach((match, index) => {
        doc.text(`${index + 1}. ${match.name.replace(' Aptitude', '')} - ${match.percentage}% match`, 20, yPos);
        yPos += 10;
      });
      
      // Add stream/course recommendations
      yPos += 10;
      doc.setFontSize(16);
      doc.text(studentClass === '10' ? 'Stream Recommendations' : 'Course Recommendations', 20, yPos);
      yPos += 10;
      doc.setFontSize(14);
      
      if (studentClass === '10') {
        const streamData = calculateStreamPercentages();
        streamData.forEach((stream, index) => {
          doc.text(`${index + 1}. ${stream.name} - ${stream.value}% compatibility`, 20, yPos);
          yPos += 10;
        });
      } else {
        const courseRecommendations = getCourseRecommendations();
        courseRecommendations.slice(0, 5).forEach((course, index) => {
          doc.text(`${index + 1}. ${course.name} - ${course.probability}% match`, 20, yPos);
          yPos += 10;
        });
      }
      
      // Save the PDF
      doc.save(`Career_Assessment_Results_Class_${studentClass}.pdf`);
      
      // Reset button
      if (downloadBtn) {
        downloadBtn.innerHTML = `
          <div class="flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Report</span>
          </div>
        `;
        downloadBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Reset button on error
      const downloadBtn = document.querySelector('.download-btn');
      if (downloadBtn) {
        downloadBtn.innerHTML = `
          <div class="flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Report</span>
          </div>
        `;
        downloadBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      }
      // Show error message to user
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div ref={resultsRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent mb-4">
            🎉 Your Career Roadmap
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
            Personalized insights for Class {studentClass} students
          </p>
        </div>

        {/* ML-Powered Career Predictions - Removed */}

        {/* Loading State */}
        {isLoadingML && (
          <div className="mb-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800 dark:text-blue-300 font-medium">
                🤖 AI is analyzing your profile using machine learning models...
              </span>
            </div>
          </div>
        )}

        {/* Key Metrics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Cognitive Score</h3>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {aptitudeScore}/10
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {aptitudeScore >= 8 ? 'Excellent' : aptitudeScore >= 6 ? 'Above Average' : aptitudeScore >= 4 ? 'Average' : 'Needs Improvement'}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Top Match</h3>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {topMatches[0]?.name.replace(' Aptitude', '')}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {topMatches[0]?.percentage}% match
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {studentClass === '10' ? 'Best Stream' : 'Career Focus'}
              </h3>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{studentClass === '10' ? '📚' : '🚀'}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {studentClass === '10' ? streamData[0]?.name : topMatches[0]?.streamName}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {studentClass === '10' ? `${streamData[0]?.value}% compatibility` : 'Recommended path'}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Aptitude Breakdown - Radar Chart */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <span className="mr-3">🔍</span>
              Aptitude Breakdown
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid gridType="polygon" className="opacity-30" />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <PolarRadiusAxis 
                    domain={[0, 30]} 
                    tickCount={4}
                    tick={{ fontSize: 10, fill: 'currentColor' }}
                    className="text-gray-500 dark:text-gray-500"
                  />
                  <Radar
                    name="Your Score"
                    dataKey="score"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <Tooltip content={CustomTooltip} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stream/Course Recommendations */}
          {studentClass === '10' ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <span className="mr-3">📊</span>
                Stream Compatibility
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={streamData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {streamData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Compatibility']}
                      labelStyle={{ color: '#374151' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <span className="mr-3">🎓</span>
                Course Match Probability
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseRecommendations.slice(0, 5)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                      tick={{ fontSize: 10, fill: 'currentColor' }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Match Probability']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar dataKey="probability" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Scores Bar Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <span className="mr-3">📈</span>
            Detailed Aptitude Scores
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis 
                  domain={[0, 30]}
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={CustomTooltip} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations */}
        {studentClass === '10' ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-12">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
              <span className="mr-3">🎯</span>
              Recommended Streams for Class 11th
            </h3>
            <div className="grid gap-6">
              {streamData.map((stream, index) => (
                <div 
                  key={stream.name}
                  className="p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 transform hover:scale-[1.02]"
                  style={{ borderColor: stream.color, backgroundColor: `${stream.color}10` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                      <span className="mr-3 text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      {stream.name} Stream
                    </h4>
                    <div className="text-2xl font-bold" style={{ color: stream.color }}>
                      {stream.value}%
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {stream.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stream.subjects.map((subject) => (
                      <span 
                        key={subject}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: stream.color }}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-12">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
              <span className="mr-3">🚀</span>
              Recommended Courses & Career Paths
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {courseRecommendations.map((course, index) => (
                <div 
                  key={course.name}
                  className="p-6 rounded-2xl bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{course.icon}</span>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                          {course.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {course.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {course.probability}%
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Match</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.probability}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetakeQuiz}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retake Assessment</span>
            </div>
          </button>
          
          <button 
            onClick={downloadPDF}
            className="download-btn px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Report</span>
            </div>
          </button>

          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Chat with Counselor</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;