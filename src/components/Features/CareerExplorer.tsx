import React, { useState } from 'react';
import { Map, Compass, TrendingUp, DollarSign, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CareerExplorer: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
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
      const q = [interests, currentSkills].filter(Boolean).join(' ').trim();
      const resp = await fetch(`/api/career/jobs?q=${encodeURIComponent(q)}&country=IN`);
      if (!resp.ok) throw new Error('Failed to fetch jobs');
      const json = await resp.json();
      if (Array.isArray(json?.jobs)) setJobs(json.jobs);
    } catch (e: any) {
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

        {/* Current Skills */}
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

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>
        )}

        <button
          onClick={handleExplore}
          disabled={isExploring || !interests.trim()}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isExploring ? (
            <>
              <Compass className="w-4 h-4 animate-spin" />
              <span>Exploring Career Paths...</span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4" />
              <span>Explore Career Paths</span>
            </>
          )}
        </button>
        <div className="mt-3">
          <button
            onClick={fetchJobs}
            disabled={isLoadingJobs || !interests.trim()}
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
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Real Jobs</h3>
          <div className="space-y-3">
            {jobs.map((j) => (
              <a key={j.id} href={j.url} target="_blank" rel="noreferrer" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{j.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{j.company} • {j.location || 'Remote'}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{j.publishedAt ? new Date(j.publishedAt).toLocaleDateString() : ''}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerExplorer;