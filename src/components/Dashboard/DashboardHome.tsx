import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award,
  ArrowRight,
  Users,
  Star
} from 'lucide-react';

interface DashboardHomeProps {
  setActiveSection: (section: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ setActiveSection }) => {
  const { token, user } = useAuth();
  const [statsData, setStatsData] = useState<{ skillsAnalyzed: number; careerExplored: number; projectsCompleted: number; achievements: number; documentsCount: number } | null>(null);
  const [activities, setActivities] = useState<Array<{ action: string; time: string; type: string }>>([]);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      try {
        const [statsRes, actRes] = await Promise.all([
          fetch('/api/dashboard/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/dashboard/activities', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (statsRes.ok) setStatsData(await statsRes.json());
        if (actRes.ok) {
          const a = await actRes.json();
          setActivities(a.activities || []);
        }
      } catch (_) {
        // ignore
      }
    }
    fetchData();
  }, [token]);

  const stats = useMemo(() => ([
    { label: 'Skills Analyzed', value: String(statsData?.skillsAnalyzed ?? 0), icon: Target, color: 'blue' },
    { label: 'Career Paths Explored', value: String(statsData?.careerExplored ?? 0), icon: TrendingUp, color: 'green' },
    { label: 'Projects Completed', value: String(statsData?.projectsCompleted ?? 0), icon: BookOpen, color: 'purple' },
    { label: 'Achievements', value: String(statsData?.achievements ?? 0), icon: Award, color: 'yellow' },
  ]), [statsData]);

  const quickActions = [
    { 
      title: 'Analyze Your Skills', 
      description: 'Upload your resume or list your skills to get AI-powered insights',
      action: () => setActiveSection('skillGap'),
      color: 'blue',
      icon: Target
    },
    { 
      title: 'Explore Career Paths', 
      description: 'Discover career opportunities that match your interests',
      action: () => setActiveSection('career'),
      color: 'green',
      icon: TrendingUp
    },
    { 
      title: 'Chat with AI Mentor', 
      description: 'Get personalized career advice and guidance',
      action: () => setActiveSection('chat'),
      color: 'purple',
      icon: Users
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to AI Career Advisor</h1>
        <p className="text-blue-100 text-lg mb-6">
          Your personal AI-powered career guidance platform
        </p>
        <button 
          onClick={() => setActiveSection('chat')}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
        >
          <span>Get Started with AI Mentor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full p-4 rounded-lg border-2 border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;