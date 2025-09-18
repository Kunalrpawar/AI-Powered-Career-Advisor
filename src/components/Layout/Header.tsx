import React from 'react';
import { Bell, User, Settings, Search, Sun, Moon } from 'lucide-react';
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
        <div className="hidden md:flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300 focus-within:ring-2 focus-within:ring-indigo-200">
          <Search className="w-4 h-4 mr-2" />
          <input className="bg-transparent outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 w-56" placeholder={t('header.search')} />
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