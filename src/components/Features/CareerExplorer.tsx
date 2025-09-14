import React, { useState } from 'react';
import { Map, Compass, TrendingUp, DollarSign, Clock, ChevronDown, ChevronUp, Upload, FileText, X, CheckCircle, Building, MapPin, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CareerExplorer: React.FC = () => {
  const [inputMode, setInputMode] = useState<'manual' | 'resume'>('manual');
  const [interests, setInterests] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [isExploring, setIsExploring] = useState(false);
  const [expandedPath, setExpandedPath] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const { token } = useAuth();

  const predefinedInterests = [
    'Web Development', 'AI/ML', 'Cybersecurity', 'Mobile Development',
    'Data Science', 'Cloud Computing', 'DevOps', 'UI/UX Design'
  ];

  const handleResumeUpload = async () => {
    if (!file) return;
    
    setIsProcessingResume(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch('/api/skill-gap/analyze', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process resume');
      }

      const result = await response.json();
      
      // Extract skills from the analysis
      if (result.analysis && result.analysis.skillBreakdown) {
        const allSkills: string[] = [];
        Object.values(result.analysis.skillBreakdown).forEach((category: any) => {
          if (category.skills) {
            allSkills.push(...category.skills);
          }
        });
        // Also include directly extracted skills from resume
        if (result.analysis.extractedSkills) {
          allSkills.push(...result.analysis.extractedSkills);
        }
        const uniqueSkills = [...new Set(allSkills)];
        setExtractedSkills(uniqueSkills);
        setCurrentSkills(uniqueSkills.join(', '));
      }
      
      // Set interests based on skills
      if (result.analysis && result.analysis.skillBreakdown) {
        const interestsFromSkills: string[] = [];
        if (result.analysis.skillBreakdown.frontend) interestsFromSkills.push('Web Development');
        if (result.analysis.skillBreakdown.mobile) interestsFromSkills.push('Mobile Development');
        if (result.analysis.skillBreakdown.dataScience) interestsFromSkills.push('Data Science');
        if (result.analysis.skillBreakdown.devops) interestsFromSkills.push('DevOps');
        setInterests(interestsFromSkills.join(', '));
      }
      
    } catch (error: any) {
      console.error('Resume processing failed:', error);
      setError(error?.message || 'Failed to process resume');
    } finally {
      setIsProcessingResume(false);
    }
  };

  const handleExplore = async () => {
    setIsExploring(true);
    
    try {
      setError(null);
      const response = await fetch('/api/career/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ interests, currentSkills }),
      });

      const result = await response.json();
      
      // Handle both demo and real responses
      if (Array.isArray(result.paths)) {
        setCareerPaths(result.paths);
      } else {
        // Demo response format
        setCareerPaths([
          {
            title: 'Frontend Developer',
            description: 'Build beautiful, responsive user interfaces using modern frameworks and technologies.',
            requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
            salaryRange: '$60,000 - $120,000',
            growthRate: '13%',
            roadmap: [
              { phase: 'Beginner', skills: ['HTML', 'CSS', 'JavaScript Basics'], duration: '2-3 months' },
              { phase: 'Intermediate', skills: ['React', 'API Integration', 'State Management'], duration: '3-4 months' },
              { phase: 'Advanced', skills: ['TypeScript', 'Performance Optimization', 'Testing'], duration: '4-6 months' },
              { phase: 'Senior', skills: ['Architecture', 'Mentoring', 'Technical Leadership'], duration: '1-2 years' }
            ]
          },
          {
            title: 'Full Stack Developer',
            description: 'Work on both frontend and backend technologies to build complete web applications.',
            requiredSkills: ['JavaScript', 'Node.js', 'React', 'Database', 'API Design'],
            salaryRange: '$75,000 - $140,000',
            growthRate: '15%',
            roadmap: [
              { phase: 'Beginner', skills: ['HTML', 'CSS', 'JavaScript', 'Basic Backend'], duration: '3-4 months' },
              { phase: 'Intermediate', skills: ['React', 'Node.js', 'Database Design'], duration: '4-5 months' },
              { phase: 'Advanced', skills: ['System Design', 'Cloud Deployment', 'Security'], duration: '6-8 months' },
              { phase: 'Senior', skills: ['Architecture', 'Team Leadership', 'DevOps'], duration: '1-3 years' }
            ]
          },
          {
            title: 'Data Scientist',
            description: 'Extract insights from data using statistical analysis, machine learning, and visualization.',
            requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
            salaryRange: '$90,000 - $160,000',
            growthRate: '22%',
            roadmap: [
              { phase: 'Beginner', skills: ['Python', 'Statistics', 'Pandas', 'Numpy'], duration: '3-4 months' },
              { phase: 'Intermediate', skills: ['Machine Learning', 'SQL', 'Visualization'], duration: '4-6 months' },
              { phase: 'Advanced', skills: ['Deep Learning', 'Big Data', 'Cloud ML'], duration: '6-12 months' },
              { phase: 'Senior', skills: ['MLOps', 'Research', 'Business Strategy'], duration: '2-3 years' }
            ]
          }
        ]);
      }
      // Reset jobs when exploring anew
      setJobs([]);
    } catch (error: any) {
      console.error('Career exploration failed:', error);
      setError(error?.message || 'Failed to explore careers');
    } finally {
      setIsExploring(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setIsLoadingJobs(true);
      setError(null);
      
      // Use extracted skills if available, otherwise use manually entered skills
      const skillsToUse = extractedSkills.length > 0 ? extractedSkills.join(', ') : currentSkills;
      const queryParts = [interests, skillsToUse].filter(Boolean);
      const q = queryParts.join(' ').trim() || 'software developer';
      
      console.log('Fetching jobs with query:', q);
      
      const resp = await fetch(`/api/career/jobs?q=${encodeURIComponent(q)}&country=IN&limit=25`);
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Failed to fetch jobs: ${errorText}`);
      }
      const json = await resp.json();
      if (Array.isArray(json?.jobs)) {
        console.log(`Received ${json.jobs.length} jobs`);
        setJobs(json.jobs);
      } else {
        console.warn('No jobs found in response:', json);
        setJobs([]);
      }
    } catch (e: any) {
      console.error('Job fetching error:', e);
      setError(e?.message || 'Failed to fetch jobs');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = interests.split(', ').filter(i => i.trim() !== '');
    if (currentInterests.includes(interest)) {
      setInterests(currentInterests.filter(i => i !== interest).join(', '));
    } else {
      setInterests([...currentInterests, interest].join(', '));
    }
  };

  const handleModeChange = (mode: 'manual' | 'resume') => {
    setInputMode(mode);
    // Clear form data when switching modes
    if (mode === 'manual') {
      setExtractedSkills([]);
      setFile(null);
    } else {
      setCurrentSkills('');
    }
    setCareerPaths([]);
    setJobs([]);
    setError(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Map className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Career Path Explorer</h2>
            <p className="text-gray-500 dark:text-gray-400">Discover career opportunities that match your interests and skills</p>
          </div>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleModeChange('manual')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              inputMode === 'manual' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-800' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Manual Input</span>
          </button>
          <button
            onClick={() => handleModeChange('resume')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              inputMode === 'resume' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-800' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume</span>
          </button>
        </div>

        {/* Resume Upload Section */}
        {inputMode === 'resume' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Upload Your Resume</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-400 dark:hover:border-green-500 transition-colors">
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
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                Choose File
              </label>
              {file && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{file.name}</span>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            {file && (
              <button
                onClick={handleResumeUpload}
                disabled={isProcessingResume}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessingResume ? (
                  <>
                    <Compass className="w-4 h-4 animate-spin" />
                    <span>Processing Resume...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Extract Skills from Resume</span>
                  </>
                )}
              </button>
            )}

            {/* Extracted Skills Display */}
            {extractedSkills.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2">Skills Extracted from Resume:</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interest Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Your Interests</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {predefinedInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  interests.includes(interest)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-800'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Or describe your interests manually..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Current Skills - Only show in manual mode */}
        {inputMode === 'manual' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Current Skills (Optional)</label>
            <textarea
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="List your current skills to get more personalized recommendations..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>
        )}

        <div className="mt-3">
          <button
            onClick={fetchJobs}
            disabled={isLoadingJobs || !interests.trim() || (inputMode === 'resume' && extractedSkills.length === 0)}
            className="w-full bg-white border border-green-200 text-green-700 py-3 rounded-lg hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoadingJobs ? 'Fetching real jobs…' : 'Find real jobs based on my interests & skills'}
          </button>
        </div>
      </div>

      {/* Career Path Results */}
      {careerPaths.length > 0 && (
        <div className="space-y-4">
          {careerPaths.map((path, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{path.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{path.description}</p>
                  </div>
                  <button
                    onClick={() => setExpandedPath(expandedPath === index ? null : index)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedPath === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Salary Range</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{path.salaryRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Growth Rate</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{path.growthRate} annually</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Time to Proficiency</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">8-12 months</p>
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.requiredSkills && path.requiredSkills.map((skill: string, skillIndex: number) => (
                      <span key={skillIndex} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Roadmap */}
              {expandedPath === index && path.roadmap && (
                <div className="border-t border-gray-100 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/50">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Learning Roadmap</h4>
                  <div className="space-y-4">
                    {path.roadmap.map((phase: any, phaseIndex: number) => (
                      <div key={phaseIndex} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-medium text-sm flex-shrink-0">
                          {phaseIndex + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-800 dark:text-gray-100">{phase.phase}</h5>
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-600 px-2 py-1 rounded">
                              {phase.duration}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {phase.skills && phase.skills.map((skill: string, skillIndex: number) => (
                              <span key={skillIndex} className="px-2 py-1 bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Real Jobs */}
      {jobs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Real Job Opportunities</h3>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              {jobs.length} Jobs Found
            </span>
          </div>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{job.title}</h4>
                      {job.source && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs">
                          {job.source}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {job.company}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location || 'Remote'}
                      </span>
                      {job.salary && (
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{job.description}</p>
                    )}
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.tags.slice(0, 5).map((tag: string, index: number) => (
                          <span key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {job.publishedAt && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(job.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {jobs.length >= 20 && (
            <div className="mt-4 text-center">
              <button 
                onClick={fetchJobs}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Load More Jobs
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerExplorer;