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
      {/* Welcome / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 2px, transparent 2px), radial-gradient(circle at 80% 30%, white 2px, transparent 2px), radial-gradient(circle at 40% 70%, white 2px, transparent 2px)' }} />
        <div className="relative p-8 lg:p-10 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">Welcome{user?.name ? `, ${user.name}` : ''} 👋</h1>
              <p className="text-indigo-100 text-base lg:text-lg">Your AI-powered companion for skills, projects, interviews, and jobs.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSection('interview')}
                className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all"
              >
                Practice Interview
              </button>
              <button
                onClick={() => setActiveSection('interview')}
                className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <span>Open AI Assistance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const color = stat.color;
          return (
            <div key={index} className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-50`}>
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
              </div>
              <div className="absolute inset-x-6 bottom-3 h-1 bg-gray-100 rounded">
                <div className={`h-full rounded bg-${color}-500`} style={{ width: `${Math.min(100, Number(stat.value) || 10)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">Recommended</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const color = action.color;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}-50 group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-3 max-h-72 overflow-auto pr-1">
            {activities.length === 0 && (
              <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">No recent activity yet. Start with a quick action.</div>
            )}
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View All Activities
          </button>
        </div>
        
        {/* Getting Started Checklist */}
        <div className="xl:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Complete Profile', desc: 'Fill your education and interests', section: 'profile' },
              { title: 'Run Skill Gap', desc: 'Upload resume or skills', section: 'skillGap' },
              { title: 'Try AI Assistance', desc: 'Interview or Mentor guidance', section: 'interview' },
            ].map((it, i) => (
              <button key={i} onClick={() => setActiveSection(it.section as any)} className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 text-left transition-all">
                <p className="font-semibold text-gray-900">{it.title}</p>
                <p className="text-sm text-gray-600">{it.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;