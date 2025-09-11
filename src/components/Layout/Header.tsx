import React from 'react';
import { Bell, User, Settings, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  return (
    <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Welcome back{user ? `, ${user.name}` : ''}!</h2>
        <p className="text-xs text-gray-500">Let’s advance your career today</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="hidden md:flex items-center px-3 py-2 rounded-lg bg-gray-50 text-gray-500 focus-within:ring-2 focus-within:ring-indigo-200">
          <Search className="w-4 h-4 mr-2" />
          <input className="bg-transparent outline-none text-sm placeholder-gray-400 w-56" placeholder="Search features, jobs, tips..." />
        </div>
        <button className="px-3 py-2 text-xs rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors">What’s new</button>
        <button onClick={toggle} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Toggle theme">
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">{user ? user.name : 'Guest'}</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          {user && (
            <button onClick={logout} className="ml-2 text-xs font-medium text-indigo-600 hover:text-indigo-800">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;