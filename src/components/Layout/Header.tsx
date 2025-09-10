import React from 'react';
import { Bell, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Welcome back{user ? `, ${user.name}` : ''}!</h2>
        <p className="text-sm text-gray-500">Let's advance your career today</p>
      </div>
      
      <div className="flex items-center space-x-4">
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
            <p className="text-sm font-medium text-gray-700">{user ? user.name : 'Guest'}</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          {user && (
            <button onClick={logout} className="ml-2 text-sm text-blue-600 hover:text-blue-800">Logout</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;