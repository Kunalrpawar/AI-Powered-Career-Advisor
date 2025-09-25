import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Award,
  ArrowRight,
  Users,
  Star,
  Map,
  MessageCircle,
  GraduationCap,
  Brain,
  Activity,
  ChevronRight,
  Clock,
  Calendar,
  RefreshCw,
  School
} from 'lucide-react';

interface DashboardHomeProps {
  setActiveSection: (section: string) => void;
}

interface ExtendedStats {
  skillsAnalyzed: number;
  careerExplored: number;
  projectsCompleted: number;
  achievements: number;
  documentsCount?: number;
  
  // Extended stats
  aptitude?: {
    totalTests: number;
    completedTests: number;
    averageScore: number;
    lastTestDate: string | null;
  };
  aiChat?: {
    totalSessions: number;
    totalMessages: number;
    averageSessionLength: number;
    mostUsedChatType: string | null;
    lastChatDate: string | null;
  };
  colleges?: {
    totalViewed: number;
    totalBookmarked: number;
    totalApplied: number;
    favoriteStates: string[];
  };
  resources?: {
    totalViewed: number;
    totalBookmarked: number;
    totalCompleted: number;
    favoriteCategories: string[];
    averageRating: number;
  };
  scholarships?: {
    totalViewed: number;
    totalApplied: number;
    totalBookmarked: number;
    approvedApplications: number;
  };
  mentoring?: {
    totalSessions: number;
    completedSessions: number;
    totalHours: number;
    averageRating: number;
    upcomingSessions: number;
  };
  careerMapping?: {
    totalMappings: number;
    completedPaths: number;
    averageProgress: number;
    topCareerInterests: string[];
  };
  profile?: {
    completeness: number;
    totalEducationEntries: number;
    totalSkills: number;
    totalProjects: number;
    totalExperience: number;
  };
}

interface Activity {
  action: string;
  time: string;
  type: string;
  icon?: string;
  color?: string;
  timestamp?: string;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ setActiveSection }) => {
  const { token, user } = useAuth();
  const { t } = useTranslation();
  const [statsData, setStatsData] = useState<ExtendedStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEnhancedView, setShowEnhancedView] = useState(false);

  // Function to fetch dashboard data with cache busting
  const fetchDashboardData = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      // Try enhanced dashboard first, fallback to regular dashboard
      const statsEndpoint = showEnhancedView ? '/api/enhanced-dashboard/stats' : '/api/dashboard/stats';
      const activitiesEndpoint = showEnhancedView ? '/api/enhanced-dashboard/activities' : '/api/dashboard/activities';
      
      // Add cache-busting parameter to prevent browser caching
      const cacheBuster = `?_=${Date.now()}`;
      
      const [statsRes, actRes] = await Promise.all([
        fetch(`${statsEndpoint}${cacheBuster}`, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate' 
          } 
        }),
        fetch(`${activitiesEndpoint}${cacheBuster}`, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          } 
        }),
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStatsData(statsData);
        // Auto-enable enhanced view if we have extended data
        if (statsData.aptitude || statsData.aiChat) {
          setShowEnhancedView(true);
        }
      } else {
        console.warn('Enhanced dashboard not available, using basic dashboard');
        // Fallback to basic dashboard
        const basicStatsRes = await fetch(`/api/dashboard/stats${cacheBuster}`, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          } 
        });
        if (basicStatsRes.ok) setStatsData(await basicStatsRes.json());
      }
      
      if (actRes.ok) {
        const a = await actRes.json();
        setActivities(a.activities || []);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      // Fallback to basic dashboard
      try {
        const cacheBuster = `?_=${Date.now()}`;
        const [statsRes, actRes] = await Promise.all([
          fetch(`/api/dashboard/stats${cacheBuster}`, { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            } 
          }),
          fetch(`/api/dashboard/activities${cacheBuster}`, { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            } 
          }),
        ]);
        if (statsRes.ok) setStatsData(await statsRes.json());
        if (actRes.ok) {
          const a = await actRes.json();
          setActivities(a.activities || []);
        }
      } catch (fallbackError) {
        console.error('Fallback dashboard fetch error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up an interval to refresh data every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [token, showEnhancedView]);

  const stats = useMemo(() => ([
    { label: t('dashboard.stats.skills_analyzed'), value: String(statsData?.skillsAnalyzed ?? 0), icon: Target, color: 'blue' },
    { label: t('dashboard.stats.career_explored'), value: String(statsData?.careerExplored ?? 0), icon: TrendingUp, color: 'green' },
    { label: t('dashboard.stats.projects_completed'), value: String(statsData?.projectsCompleted ?? 0), icon: BookOpen, color: 'purple' },
    { label: t('dashboard.stats.achievements'), value: String(statsData?.achievements ?? 0), icon: Award, color: 'yellow' },
  ]), [statsData, t]);
  
  // Enhanced stats for detailed view
  const enhancedStats = useMemo(() => {
    if (!showEnhancedView || !statsData) return [];
    
    const enhanced = [];
    
    if (statsData.aptitude) {
      enhanced.push({
        title: 'Aptitude Tests',
        value: statsData.aptitude.completedTests,
        total: statsData.aptitude.totalTests,
        subtitle: `Avg Score: ${Math.round(statsData.aptitude.averageScore)}%`,
        icon: Brain,
        color: 'blue',
        section: 'aptitude'
      });
    }
    
    if (statsData.aiChat) {
      enhanced.push({
        title: 'AI Conversations',
        value: statsData.aiChat.totalSessions,
        total: statsData.aiChat.totalMessages,
        subtitle: `${statsData.aiChat.totalMessages} messages`,
        icon: MessageCircle,
        color: 'purple',
        section: 'chat'
      });
    }
    
    if (statsData.colleges) {
      enhanced.push({
        title: 'College Exploration',
        value: statsData.colleges.totalViewed,
        total: statsData.colleges.totalApplied,
        subtitle: `${statsData.colleges.totalApplied} applied`,
        icon: GraduationCap,
        color: 'orange',
        section: 'colleges'
      });
    }
    
    if (statsData.mentoring) {
      enhanced.push({
        title: 'Mentoring Sessions',
        value: statsData.mentoring.completedSessions,
        total: statsData.mentoring.totalSessions,
        subtitle: `${Math.round(statsData.mentoring.totalHours)}h total`,
        icon: Users,
        color: 'indigo',
        section: 'mentor'
      });
    }
    
    return enhanced;
  }, [statsData, showEnhancedView]);

  const quickActions = [
    { 
      title: t('dashboard.actions.analyze_skills'), 
      description: t('dashboard.actions.analyze_skills_desc'),
      action: () => setActiveSection('skillGap'),
      color: 'blue',
      icon: Target
    },
    { 
      title: t('dashboard.actions.explore_careers'), 
      description: t('dashboard.actions.explore_careers_desc'),
      action: () => setActiveSection('career'),
      color: 'green',
      icon: TrendingUp
    },
    { 
      title: t('dashboard.actions.chat_mentor'), 
      description: t('dashboard.actions.chat_mentor_desc'),
      action: () => setActiveSection('chat'),
      color: 'purple',
      icon: Users
    },
    { 
      title: t('dashboard.actions.career_mapping'), 
      description: t('dashboard.actions.career_mapping_desc'),
      action: () => setActiveSection('mapping'),
      color: 'orange',
      icon: Map
    },
    { 
      title: t('dashboard.actions.scholarships'), 
      description: t('dashboard.actions.scholarships_desc'),
      action: () => setActiveSection('scholarships'),
      color: 'pink',
      icon: GraduationCap
    },
    { 
      title: t('dashboard.actions.colleges'), 
      description: t('dashboard.actions.colleges_desc'),
      action: () => setActiveSection('colleges'),
      color: 'teal',
      icon: School
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
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2">{t('dashboard.hero.welcome')}{user?.name ? `, ${user.name}` : ''} 👋</h1>
              <p className="text-indigo-100 text-base lg:text-lg">{t('dashboard.hero.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveSection('interview')}
                className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all"
              >
                {t('dashboard.hero.practice_interview')}
              </button>
              <button
                onClick={() => setActiveSection('interview')}
                className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <span>{t('dashboard.hero.open_ai_assistance')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('dashboard.stats.title') || 'Stats'}</h3>
        <button 
          onClick={fetchDashboardData} 
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? t('common.loading') : t('dashboard.refresh') || 'Refresh'}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const color = stat.color;
          return (
            <div key={index} className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${color}-50 dark:bg-${color}-900/30`}>
                  <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-300`} />
                </div>
              </div>
              <div className="absolute inset-x-6 bottom-3 h-1 bg-gray-100 dark:bg-gray-700 rounded">
                <div className={`h-full rounded bg-${color}-500 dark:bg-${color}-400`} style={{ width: `${Math.min(100, Number(stat.value) || 10)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Stats Section - Only show if we have enhanced data */}
      {showEnhancedView && enhancedStats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Detailed Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Comprehensive overview of your learning journey</p>
            </div>
            <button 
              onClick={() => setShowEnhancedView(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Collapse
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {enhancedStats.map((stat, index) => {
              const Icon = stat.icon;
              const color = stat.color;
              return (
                <button
                  key={index}
                  onClick={() => setActiveSection(stat.section)}
                  className={`p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-${color}-200 dark:hover:border-${color}-800 hover:bg-${color}-50 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group bg-white dark:bg-gray-800`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-50 dark:bg-${color}-900/30 group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-300`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">{stat.title}</h4>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</span>
                        {stat.total !== undefined && stat.total !== stat.value && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">/ {stat.total}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{stat.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Profile Completion Widget */}
          {statsData?.profile && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Profile Completion</h4>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{statsData.profile.completeness}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${statsData.profile.completeness}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-medium text-blue-800 dark:text-blue-200">{statsData.profile.totalEducationEntries}</div>
                  <div className="text-blue-600 dark:text-blue-300">Education</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-800 dark:text-blue-200">{statsData.profile.totalSkills}</div>
                  <div className="text-blue-600 dark:text-blue-300">Skills</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-800 dark:text-blue-200">{statsData.profile.totalProjects}</div>
                  <div className="text-blue-600 dark:text-blue-300">Projects</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-800 dark:text-blue-200">{statsData.profile.totalExperience}</div>
                  <div className="text-blue-600 dark:text-blue-300">Experience</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Toggle Enhanced View Button */}
      {!showEnhancedView && statsData && (statsData.aptitude || statsData.aiChat) && (
        <div className="text-center">
          <button
            onClick={() => setShowEnhancedView(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Activity className="w-4 h-4" />
            View Detailed Analytics
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('dashboard.quick_actions')}</h3>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{t('dashboard.recommended')}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.slice(0, 4).map((action, index) => {
              const Icon = action.icon;
              const color = action.color;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}-50 dark:bg-${color}-900/30 group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-300`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Additional Quick Actions (5th and 6th cards) */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {/* Scholarships Card */}
            <button
              onClick={() => setActiveSection('scholarships')}
              className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group bg-white dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-pink-50 dark:bg-pink-900/30 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5 text-pink-600 dark:text-pink-300" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('dashboard.actions.scholarships')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.actions.scholarships_desc')}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
            
            {/* Government Colleges Card */}
            <button
              onClick={() => setActiveSection('colleges')}
              className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group bg-white dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-teal-50 dark:bg-teal-900/30 group-hover:scale-105 transition-transform">
                  <School className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('dashboard.actions.colleges')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.actions.colleges_desc')}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('dashboard.recent_activities')}</h3>
          <div className="space-y-3 max-h-72 overflow-auto pr-1">
            {activities.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">{t('dashboard.no_activity')}</div>
            )}
            {activities.map((activity, index) => {
              // Enhanced activity rendering with icons and colors
              const getActivityIcon = (type: string, iconName?: string) => {
                if (iconName) {
                  switch (iconName) {
                    case 'target': return Target;
                    case 'message-circle': return MessageCircle;
                    case 'graduation-cap': return GraduationCap;
                    case 'book-open': return BookOpen;
                    case 'award': return Award;
                    case 'users': return Users;
                    case 'map': return Map;
                    default: return Activity;
                  }
                }
                // Fallback based on type
                switch (type) {
                  case 'aptitude_test': return Target;
                  case 'ai_chat': return MessageCircle;
                  case 'college': return GraduationCap;
                  case 'resource': return BookOpen;
                  case 'scholarship': return Award;
                  case 'mentor_session': return Users;
                  case 'career_mapping': return Map;
                  default: return Activity;
                }
              };
              
              const getActivityColor = (type: string, color?: string) => {
                if (color) return color;
                switch (type) {
                  case 'aptitude_test': return 'blue';
                  case 'ai_chat': return 'purple';
                  case 'college': return 'green';
                  case 'resource': return 'orange';
                  case 'scholarship': return 'yellow';
                  case 'mentor_session': return 'indigo';
                  case 'career_mapping': return 'red';
                  default: return 'gray';
                }
              };
              
              const ActivityIcon = getActivityIcon(activity.type, activity.icon);
              const activityColor = getActivityColor(activity.type, activity.color);
              
              return (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                  <div className={`w-8 h-8 rounded-full bg-${activityColor}-100 dark:bg-${activityColor}-900/30 flex items-center justify-center flex-shrink-0`}>
                    <ActivityIcon className={`w-4 h-4 text-${activityColor}-600 dark:text-${activityColor}-300`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{activity.action}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      {showEnhancedView && activity.timestamp && (
                        <Clock className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            {t('dashboard.view_all_activities')}
          </button>
        </div>
        
        {/* Getting Started Checklist */}
        <div className="xl:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('dashboard.getting_started')}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: t('dashboard.steps.complete_profile'), desc: t('dashboard.steps.complete_profile_desc'), section: 'profile' },
              { title: t('dashboard.steps.run_skill_gap'), desc: t('dashboard.steps.run_skill_gap_desc'), section: 'skillGap' },
              { title: t('dashboard.steps.try_ai_assistance'), desc: t('dashboard.steps.try_ai_assistance_desc'), section: 'interview' },
            ].map((it, i) => (
              <button key={i} onClick={() => setActiveSection(it.section as any)} className="p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-gray-700/40 text-left transition-all bg-white dark:bg-gray-800">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{it.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{it.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;