import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Settings, Search, Sun, Moon, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  setActiveSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setActiveSection }) => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Navigation sections - used for search results
  const sections = [
    { id: 'dashboard', name: 'Dashboard', keywords: ['home', 'overview', 'stats', 'dashboard'] },
    { id: 'skill-gap', name: 'Skill Gap Analysis', keywords: ['skills', 'gap', 'analysis', 'improvement'] },
    { id: 'career-explorer', name: 'Career Explorer', keywords: ['career', 'path', 'explore', 'future', 'job'] },
    { id: 'interview', name: 'Interview Preparation', keywords: ['interview', 'prepare', 'questions', 'practice'] },
    { id: 'job-matcher', name: 'Job Matcher', keywords: ['job', 'search', 'apply', 'match', 'employment'] },
    { id: 'quiz', name: 'Aptitude Quiz', keywords: ['quiz', 'test', 'aptitude', 'assessment'] },
    { id: 'project-generator', name: 'Project Generator', keywords: ['project', 'create', 'generate', 'portfolio'] },
    { id: 'colleges', name: 'Colleges Directory', keywords: ['college', 'university', 'education', 'school'] },
    { id: 'mentor', name: 'AI Mentor', keywords: ['mentor', 'guidance', 'advice', 'chat', 'ai'] },
    { id: 'courses', name: 'Course Mapping', keywords: ['course', 'classes', 'learning', 'education'] },
    { id: 'webrtc', name: 'Video Meetings', keywords: ['video', 'meeting', 'call', 'conference'] },
    { id: 'profile', name: 'My Profile', keywords: ['profile', 'account', 'settings', 'personal'] },
  ];
  
  // Search function
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    
    // Search through the sections based on keywords and name
    const query = searchQuery.toLowerCase();
    const results = sections.filter(section => {
      return (
        section.name.toLowerCase().includes(query) || 
        section.keywords.some(keyword => keyword.includes(query))
      );
    });
    
    setSearchResults(results);
    setShowResults(true);
    setIsSearching(false);
  };
  
  // Handle outside click to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search on input change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 300); // Debounce search for better performance
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Avatar mapping
  const avatarEmojis: { [key: string]: string } = {
    'avatar1': '👨‍💻',
    'avatar2': '👩‍🎓',
    'avatar3': '👨‍🎨',
    'avatar4': '👩‍🔬',
    'avatar5': '👨‍⚕️',
    'avatar6': '👩‍💼',
    'avatar7': '👨‍🏫',
    'avatar8': '👩‍🎤',
    'avatar9': '👨‍🚀'
  };
  
  const getUserAvatar = () => {
    if (user?.metadata?.avatar && avatarEmojis[user.metadata.avatar]) {
      return avatarEmojis[user.metadata.avatar];
    }
    return null;
  };
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-900/60 shadow-sm border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 relative z-50">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.welcome')}{user ? `, ${user.name}` : ''}!</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.subtitle')}</p>
      </div>

      <div className="flex items-center space-x-2">
        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300 focus-within:ring-2 focus-within:ring-indigo-200">
            <Search className="w-4 h-4 mr-2" />
            <input 
              className="bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 w-56" 
              placeholder={t('header.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {searchQuery && (
              <button 
                className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowResults(false);
                }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                {searchResults.length} results found
              </div>
              <div>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center"
                    onClick={() => {
                      setActiveSection(result.id);
                      setShowResults(false);
                      setSearchQuery('');
                    }}
                  >
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{result.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.keywords.slice(0, 3).join(', ')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* No Results State */}
          {showResults && searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-center z-50">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-800 dark:text-gray-200 font-medium">No results found</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Try searching for different keywords
              </p>
            </div>
          )}
        </div>
       
        <LanguageSwitcher />
        <button onClick={toggle} className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Toggle theme">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setActiveSection('profile')}
            className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              getUserAvatar() 
                ? 'bg-white/20 backdrop-blur border border-white/30' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              {getUserAvatar() ? (
                <span className="text-lg">{getUserAvatar()}</span>
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user ? user.name : 'Guest'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
            </div>
          </button>
          {user && (
            <button 
              onClick={logout} 
              className="ml-2 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              {t('header.logout')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;