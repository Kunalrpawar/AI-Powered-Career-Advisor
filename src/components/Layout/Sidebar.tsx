import React from 'react';
import { 
  BarChart3, 
  Map, 
  Lightbulb, 
  Home,
  Bot,
  Mic,
  ListChecks,
  School,
  CalendarDays,
  UserCircle2,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'skillGap', icon: BarChart3, label: 'Skills & Career Tools' },
  // { id: 'chat', icon: MessageCircle, label: 'AI Mentor' },
  { id: 'projects', icon: Lightbulb, label: 'Projects & Hackathons' },
  { id: 'interview', icon: Mic, label: 'AI Assistance' },
  { id: 'quiz', icon: ListChecks, label: 'Aptitude & Interest Quiz' },
  { id: 'mapping', icon: School, label: 'Course → Career Mapping' },
  { id: 'colleges', icon: Map, label: 'Government Colleges' },
  { id: 'timeline', icon: CalendarDays, label: 'Timeline Tracker' },
  { id: 'profile', icon: UserCircle2, label: 'Profile' },
  { id: 'recommendations', icon: Sparkles, label: 'Recommendations' },
  { id: 'mentor', icon: UserCircle2, label: 'Mentor Portal' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <div className="w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-gray-900/70 shadow-lg h-screen fixed left-0 top-0 z-10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">AI Career</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Advisor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 overflow-y-auto min-h-0 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-900'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      
    </div>
  );
};

export default Sidebar;