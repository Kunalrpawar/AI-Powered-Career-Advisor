import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  Upload, 
  FileText, 
  MapPin, 
  DollarSign, 
  Star,
  ExternalLink,
  Download
} from 'lucide-react';

const JobMatcher: React.FC = () => {
  const [matchType, setMatchType] = useState<'upload' | 'profile'>('profile');
  const [profileSummary, setProfileSummary] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { token } = useAuth();

  const handleMatch = async () => {
    setIsMatching(true);
    
    try {
      const formData = new FormData();
      formData.append('profileSummary', profileSummary);

      const response = await fetch('/api/jobs/match', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      const result = await response.json();
      setMatches(result.matches || []);
    } catch (error) {
      console.error('Job matching failed:', error);
    } finally {
      setIsMatching(false);
    }
  };

  const generateCoverLetter = async (job: any) => {
    setIsGenerating(true);
    setSelectedJob(job);
    
    try {
      const response = await fetch('/api/jobs/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          jobTitle: job.title,
          company: job.company,
          userProfile: profileSummary || 'Enthusiastic software developer with passion for technology'
        }),
      });

      const result = await response.json();
      setCoverLetter(result.coverLetter);
    } catch (error) {
      console.error('Cover letter generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Job & Internship Matching</h2>
            <p className="text-gray-500 dark:text-gray-400">Find opportunities that match your skills and experience</p>
          </div>
        </div>

        {/* Match Type Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMatchType('profile')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              matchType === 'profile' 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Profile Summary</span>
          </button>
          <button
            onClick={() => setMatchType('upload')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              matchType === 'upload' 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-800' 
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume</span>
          </button>
        </div>

        {/* Input Section */}
        {matchType === 'profile' ? (
          <div className="space-y-4">
            <label htmlFor="profile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Describe your skills, experience, and career interests
            </label>
            <textarea
              id="profile"
              value={profileSummary}
              onChange={(e) => setProfileSummary(e.target.value)}
              placeholder="e.g., Frontend developer with 2+ years experience in React, JavaScript, and CSS. Passionate about creating user-friendly interfaces and interested in full-stack development..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Upload your resume</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">PDF, DOC, or DOCX format</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Choose File
            </label>
          </div>
        )}

        <button
          onClick={handleMatch}
          disabled={isMatching || (matchType === 'profile' && !profileSummary.trim())}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isMatching ? (
            <>
              <Briefcase className="w-4 h-4 animate-pulse" />
              <span>Finding Matches...</span>
            </>
          ) : (
            <>
              <Briefcase className="w-4 h-4" />
              <span>Find Job Matches</span>
            </>
          )}
        </button>
      </div>

      {/* Job Matches */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Job Matches for You</h3>
          <div className="grid grid-cols-1 gap-4">
            {matches.map((job, index) => (
              <div key={job.id || index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{job.title}</h4>
                      {job.fitPercentage && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{job.fitPercentage}% match</span>
                        </div>
                      )}
                    </div>
                    <p className="text-indigo-600 font-medium mb-1">{job.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Required Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {job.skills && job.skills.map((skill: string, skillIndex: number) => (
                      <span key={skillIndex} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Job</span>
                  </button>
                  <button 
                    onClick={() => generateCoverLetter(job)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generate Cover Letter</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cover Letter Modal */}
      {selectedJob && coverLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Cover Letter for {selectedJob.title}
                </h3>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setCoverLetter('');
                  }}
                  className="text-gray-400 dark:text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isGenerating ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-500 dark:text-gray-400">Generating personalized cover letter...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans text-sm leading-relaxed">
                      {coverLetter}
                    </pre>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Copy to Clipboard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatcher;