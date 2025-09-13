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
      // If upload mode, first upload the file to persist metadata
      if (analysisType === 'upload') {
        if (!file) throw new Error('Please choose a file');
        const up = new FormData();
        up.append('file', file);
        const uploaded = await fetch('/api/documents/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: up,
        });
        if (!uploaded.ok) {
          const t = await uploaded.text();
          throw new Error(`Upload failed: ${t}`);
        }
      }

      const formData = new FormData();
      if (analysisType === 'manual') {
        formData.append('skills', skills);
      }

      const response = await fetch('/api/skill-gap/analyze', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      const result = await response.json();
      setAnalysis(result.analysis);
      setIsDemoMode(result.isDemoMode);
    } catch (error) {
      console.error('Analysis failed:', error);
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

          {/* Strengths */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              Your Strengths
            </h3>
            {analysis.strengths && analysis.strengths.length > 0 ? (
              <div className="space-y-2">
                {analysis.strengths.map((strength: string, index: number) => (
                  <ProgressBar 
                    key={index}
                    skill={strength} 
                    percentage={85 + Math.floor(Math.random() * 15)} 
                    color="green"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Strong foundation in frontend technologies and problem-solving.</p>
            )}
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              Areas for Improvement
            </h3>
            {analysis.weaknesses && analysis.weaknesses.length > 0 ? (
              <div className="space-y-2">
                {analysis.weaknesses.map((weakness: string, index: number) => (
                  <ProgressBar 
                    key={index}
                    skill={weakness} 
                    percentage={30 + Math.floor(Math.random() * 40)} 
                    color="orange"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Focus on backend development and system architecture skills.</p>
            )}
          </div>

          {/* Learning Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Learning Recommendations</h3>
            {analysis.recommendations && analysis.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">{rec.skill}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <div className="space-y-1">
                      {rec.resources && rec.resources.map((resource: string, idx: number) => (
                        <p key={idx} className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          • {resource}
                        </p>
                      ))}
                    </div>
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
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalyzer;