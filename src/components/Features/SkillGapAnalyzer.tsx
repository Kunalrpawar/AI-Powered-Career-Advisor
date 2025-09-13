import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Upload, FileText, Zap, TrendingUp, AlertCircle } from 'lucide-react';

const SkillGapAnalyzer: React.FC = () => {
  const [analysisType, setAnalysisType] = useState<'upload' | 'manual'>('upload');
  const [skills, setSkills] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      
      if (analysisType === 'upload') {
        if (!file) throw new Error('Please choose a file');
        formData.append('resume', file);
        console.log('Sending file:', file.name);
      } else if (analysisType === 'manual') {
        if (!skills.trim()) throw new Error('Please enter your skills');
        formData.append('skills', skills);
        console.log('Sending skills:', skills);
      } else {
        throw new Error('Please select an analysis type');
      }

      const response = await fetch('/api/skill-gap/analyze', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${errorText}`);
      }

      const result = await response.json();
      setAnalysis(result.analysis);
      setIsDemoMode(result.isDemoMode);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ProgressBar: React.FC<{ skill: string; percentage: number; color: string }> = 
    ({ skill, percentage, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">{skill}</span>
        <span className={`text-${color}-600 dark:text-${color}-400`}>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`bg-${color}-500 h-2 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  const SkillCategoryCard: React.FC<{ 
    category: string; 
    data: any; 
    color: string;
  }> = ({ category, data, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">{category}</h4>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
            {data.score || 0}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`bg-${color}-500 h-3 rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${data.score || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Market Demand and Learning Curve */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {data.marketDemand && (
          <div className="text-center">
            <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Market Demand</h5>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              data.marketDemand === 'Very High' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : data.marketDemand === 'High'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {data.marketDemand}
            </span>
          </div>
        )}
        {data.learningCurve && (
          <div className="text-center">
            <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Learning Curve</h5>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              data.learningCurve === 'Easy' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : data.learningCurve === 'Medium'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {data.learningCurve}
            </span>
          </div>
        )}
      </div>

      {data.skills && data.skills.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Skills</h5>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.missing && data.missing.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Missing Skills</h5>
          <div className="flex flex-wrap gap-2">
            {data.missing.map((skill: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.priority && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            data.priority === 'High' 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : data.priority === 'Medium'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            {data.priority}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Skill Gap Analyzer</h2>
            <p className="text-gray-500 dark:text-gray-400">Discover your strengths and areas for improvement</p>
          </div>
        </div>

        {/* Analysis Type Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setAnalysisType('upload')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              analysisType === 'upload' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume</span>
          </button>
          <button
            onClick={() => setAnalysisType('manual')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              analysisType === 'manual' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Enter Manually</span>
          </button>
        </div>

        {/* Input Section */}
        {analysisType === 'upload' ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Upload your resume</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Support for PDF, DOC, and DOCX files</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              id="resume-upload"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="resume-upload"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Choose File
            </label>
            {file && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Selected: {file.name}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              List your current skills (separated by commas)
            </label>
            <textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js, Python, SQL, Git..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (analysisType === 'manual' && !skills.trim()) || (analysisType === 'upload' && !file)}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Analyze Skills</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {isDemoMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">Demo mode: Add your Gemini API key for personalized analysis</p>
            </div>
          )}

          {/* Overall Score */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Overall Skill Score</h3>
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={`${analysis.overallScore || 75}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-100">{analysis.overallScore || 75}%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-300">Your current skill level positions you well for entry to mid-level roles.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Focus on the recommended skills to reach senior level.</p>
              </div>
            </div>
          </div>

          {/* Skill Breakdown by Category */}
          {analysis.skillBreakdown && Object.keys(analysis.skillBreakdown).length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Skill Breakdown by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(analysis.skillBreakdown).map(([category, data]: [string, any]) => {
                  const colors = {
                    frontend: 'blue',
                    backend: 'green',
                    devops: 'purple',
                    softSkills: 'orange',
                    database: 'indigo',
                    mobile: 'pink'
                  };
                  return (
                    <SkillCategoryCard
                      key={category}
                      category={category}
                      data={data}
                      color={colors[category as keyof typeof colors] || 'gray'}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Enhanced Strengths */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              Your Strengths
            </h3>
            {analysis.strengths && analysis.strengths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.strengths.map((strength: any, index: number) => (
                  <div key={index} className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">{strength.skill || strength}</h4>
                      {strength.level && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                          {strength.level}
                        </span>
                      )}
                    </div>
                    {strength.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{strength.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Strong foundation in frontend technologies and problem-solving.</p>
            )}
          </div>

          {/* Enhanced Areas for Improvement */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              Areas for Improvement
            </h3>
            {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.weaknesses.map((weakness: any, index: number) => (
                  <div key={index} className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">{weakness.skill || weakness}</h4>
                      <div className="flex items-center space-x-2">
                        {weakness.level && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs font-medium">
                            {weakness.level}
                          </span>
                        )}
                        {weakness.impact && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            weakness.impact === 'High' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {weakness.impact} Impact
                          </span>
                        )}
                      </div>
                    </div>
                    {weakness.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{weakness.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Focus on backend development and system architecture skills.</p>
            )}
          </div>

          {/* Enhanced Learning Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Learning Recommendations</h3>
            {analysis.recommendations && analysis.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">{rec.skill}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'High' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : rec.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {rec.priority} Priority
                        </span>
                        {rec.difficulty && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                            {rec.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {rec.reason && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{rec.reason}</p>
                    )}
                    
                    {rec.timeline && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                        <strong>Timeline:</strong> {rec.timeline}
                      </p>
                    )}
                    
                    {rec.resources && rec.resources.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resources:</h5>
                        <div className="space-y-1">
                          {rec.resources.map((resource: string, idx: number) => (
                            <p key={idx} className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                              • {resource}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Node.js</h4>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 bg-red-100 text-red-700">
                    High Priority
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">• FreeCodeCamp</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">• Node.js Documentation</p>
                  </div>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">MongoDB</h4>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 bg-yellow-100 text-yellow-700">
                    Medium Priority
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">• MongoDB University</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">• YouTube Tutorials</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Career Path Analysis */}
          {analysis.careerPath && Object.keys(analysis.careerPath).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Career Path Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Current Level</h4>
                  <p className="text-lg text-blue-600 dark:text-blue-400">{analysis.careerPath.currentLevel || 'Junior Developer'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Target Level</h4>
                  <p className="text-lg text-green-600 dark:text-green-400">{analysis.careerPath.targetLevel || 'Mid-Level Developer'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Time to Target</h4>
                  <p className="text-lg text-purple-600 dark:text-purple-400">{analysis.careerPath.timeToTarget || '6-12 months'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">Key Milestones</h4>
                  <ul className="space-y-1">
                    {analysis.careerPath.keyMilestones && analysis.careerPath.keyMilestones.map((milestone: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">• {milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Market Analysis */}
          {analysis.marketAnalysis && Object.keys(analysis.marketAnalysis).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Indian Market Analysis</h3>
              
              {/* Top Row - Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Demand Level</h4>
                  <p className={`text-lg font-bold ${
                    analysis.marketAnalysis.demandLevel === 'Very High' 
                      ? 'text-green-600 dark:text-green-400'
                      : analysis.marketAnalysis.demandLevel === 'High'
                      ? 'text-blue-600 dark:text-blue-400'
                      : analysis.marketAnalysis.demandLevel === 'Medium'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {analysis.marketAnalysis.demandLevel || 'High'}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Average Salary</h4>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {analysis.marketAnalysis.averageSalary || '₹6,00,000 - ₹12,00,000'}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Growth Rate</h4>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {analysis.marketAnalysis.growthRate || '18% annually'}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">Job Openings</h4>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {analysis.marketAnalysis.jobOpenings || '15,000+'}
                  </p>
                </div>
              </div>

              {/* Salary Ranges */}
              {analysis.marketAnalysis.salaryRange && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">Salary Ranges by Experience</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(analysis.marketAnalysis.salaryRange).map(([level, salary]: [string, any]) => (
                      <div key={level} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize mb-1">{level}</h5>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{salary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Skills in Demand */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">Key Skills in Demand</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.marketAnalysis.keySkillsInDemand && analysis.marketAnalysis.keySkillsInDemand.map((skill: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Companies and Market Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysis.marketAnalysis.topCompanies && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">Top Companies Hiring</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.marketAnalysis.topCompanies.map((company: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">Market Insights</h4>
                  <div className="space-y-2">
                    {analysis.marketAnalysis.startupEcosystem && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Startup Ecosystem:</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{analysis.marketAnalysis.startupEcosystem}</span>
                      </div>
                    )}
                    {analysis.marketAnalysis.remoteWorkPercentage && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Remote Work:</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{analysis.marketAnalysis.remoteWorkPercentage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Learning Path */}
          {analysis.learningPath && Object.keys(analysis.learningPath).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Structured Learning Path</h3>
              <div className="space-y-6">
                {analysis.learningPath.immediate && analysis.learningPath.immediate.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-bold mr-2">1</span>
                      Immediate (Next 1-2 months)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.learningPath.immediate.map((item: any, index: number) => (
                        <div key={index} className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                          <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2">{item.skill}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Duration: {item.duration}</p>
                          <div className="space-y-1">
                            {item.resources && item.resources.map((resource: string, idx: number) => (
                              <p key={idx} className="text-xs text-blue-600 dark:text-blue-400">• {resource}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.learningPath.shortTerm && analysis.learningPath.shortTerm.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-sm font-bold mr-2">2</span>
                      Short Term (2-6 months)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.learningPath.shortTerm.map((item: any, index: number) => (
                        <div key={index} className="border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                          <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2">{item.skill}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Duration: {item.duration}</p>
                          <div className="space-y-1">
                            {item.resources && item.resources.map((resource: string, idx: number) => (
                              <p key={idx} className="text-xs text-blue-600 dark:text-blue-400">• {resource}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.learningPath.longTerm && analysis.learningPath.longTerm.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3 flex items-center">
                      <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-bold mr-2">3</span>
                      Long Term (6+ months)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.learningPath.longTerm.map((item: any, index: number) => (
                        <div key={index} className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                          <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-2">{item.skill}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Duration: {item.duration}</p>
                          <div className="space-y-1">
                            {item.resources && item.resources.map((resource: string, idx: number) => (
                              <p key={idx} className="text-xs text-blue-600 dark:text-blue-400">• {resource}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {analysis.certifications && analysis.certifications.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recommended Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.certifications.map((cert: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-1">{cert.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{cert.provider}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cert.relevance === 'High' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : cert.relevance === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {cert.relevance} Relevance
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                        <span className="ml-1 font-medium text-gray-800 dark:text-gray-200">{cert.cost}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="ml-1 font-medium text-gray-800 dark:text-gray-200">{cert.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Preparation */}
          {analysis.interviewPrep && Object.keys(analysis.interviewPrep).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Interview Preparation Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">Technical Rounds</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Number of Rounds:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{analysis.interviewPrep.technicalRounds || 3}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Common Topics:</span>
                      <div className="flex flex-wrap gap-1">
                        {analysis.interviewPrep.commonTopics && analysis.interviewPrep.commonTopics.map((topic: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">Practice Platforms</h4>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {analysis.interviewPrep.codingPlatforms && analysis.interviewPrep.codingPlatforms.map((platform: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-sm">
                          {platform}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Mock Interviews:</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{analysis.interviewPrep.mockInterviews || 'Recommended'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio Projects:</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{analysis.interviewPrep.portfolioProjects || '3-5 required'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalyzer;