import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Trophy, Star, Target, BookOpen, Users, Sparkles, Heart } from 'lucide-react';
import { badgeService, Badge } from '../../services/badgeService';

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [classStd, setClassStd] = useState<string>('12');
  const [interests, setInterests] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);

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

  useEffect(() => {
    if (user) {
      setAge(user.age?.toString() || '');
      setGender(user.gender || '');
      setClassStd(user.classStd || '12');
      setInterests(user.academicInterests?.join(', ') || '');
      
      // Generate personalized message based on user data
      generatePersonalizedMessage();
      
      // Load user badges
      loadUserBadges();
    }
  }, [user]);

  const loadUserBadges = async () => {
    if (!token) {
      console.log('❌ No token available for loading badges');
      return;
    }
    
    console.log('🔄 Loading user badges...');
    setLoadingBadges(true);
    try {
      const response = await badgeService.getMyBadges();
      console.log('✅ Badges loaded successfully:', response);
      setBadges(response.badges);
    } catch (error) {
      console.error('❌ Failed to load badges:', error);
      // Set empty array instead of leaving undefined
      setBadges([]);
    } finally {
      setLoadingBadges(false);
    }
  };

  const generatePersonalizedMessage = async () => {
    if (!user || !token) return;
    
    setLoadingMessage(true);
    try {
      const userData = {
        name: user.name,
        avatar: user.metadata?.avatar,
        dreams: user.metadata?.dreams,
        interests: user.academicInterests,
        class: user.classStd,
        gender: user.gender
      };
      
      const response = await fetch('/api/chat/personalized-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userData })
      });
      
      if (response.ok) {
        const data = await response.json();
        setPersonalizedMessage(data.message);
      }
    } catch (error) {
      console.error('Failed to generate personalized message:', error);
      setPersonalizedMessage(`Hey ${user.name}! You're on an amazing journey of learning and growth. Keep exploring your interests and chasing your dreams! 🌟`);
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
          classStd,
          academicInterests: interests.split(',').map(i => i.trim()).filter(Boolean)
        })
      });
      if (response.ok) {
        setIsEditing(false);
        // Refresh user data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const badgeCategories = {
    aptitude: { icon: Target, color: 'blue', name: 'Aptitude Master' },
    skill: { icon: BookOpen, color: 'green', name: 'Skill Builder' },
    career: { icon: Users, color: 'purple', name: 'Career Explorer' },
    project: { icon: Star, color: 'orange', name: 'Project Creator' },
    interview: { icon: Trophy, color: 'red', name: 'Interview Pro' }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Avatar and Personalized Message */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center space-x-4 mb-4">
            {user?.metadata?.avatar && (
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-6xl">
                {avatarEmojis[user.metadata.avatar] || '🚀'}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 🌟</h1>
              {user?.metadata?.dreams && (
                <p className="text-blue-100 text-lg">
                  <Heart className="w-5 h-5 inline mr-2" />
                  Dream: {user.metadata.dreams}
                </p>
              )}
            </div>
          </div>
          
          {/* Personalized AI Message */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Your Personalized Message</h3>
                {loadingMessage ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/80">Generating your personalized message...</span>
                  </div>
                ) : (
                  <p className="text-white/90 leading-relaxed">
                    {personalizedMessage || `Hey ${user?.name}! You're on an amazing journey of learning and growth. Keep exploring your interests and chasing your dreams! 🌟`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Profile Details</h2>
            <p className="text-gray-600 dark:text-gray-300">Customize your preferences to get better recommendations.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input value={user?.name || ''} readOnly className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input value={user?.email || ''} readOnly className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                  <input 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    disabled={!isEditing}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-700" 
                    placeholder="18" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                  <select 
                    value={classStd} 
                    onChange={(e) => setClassStd(e.target.value)} 
                    disabled={!isEditing}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-700"
                  >
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)} 
                  disabled={!isEditing}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-700"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Academic Interests</label>
                {!isEditing && user?.academicInterests && user.academicInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.academicInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : null}
                <textarea 
                  value={interests} 
                  onChange={(e) => setInterests(e.target.value)} 
                  disabled={!isEditing}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-700" 
                  rows={3} 
                  placeholder="e.g., Computer Science, Mathematics, Physics..." 
                />
              </div>
              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Badges Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Your Badges
              </h3>
              {loadingBadges ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading badges...</span>
                </div>
              ) : badges.length > 0 ? (
                <div className="space-y-3">
                  {badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="w-12 h-12 rounded-full shadow-md bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        {badge.image ? (
                          <img 
                            src={badge.image} 
                            alt={badge.name} 
                            className="w-12 h-12 rounded-full shadow-md"
                            onError={(e) => {
                              // Fallback to emoji if image fails
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '🏆';
                                parent.className += ' text-2xl';
                              }
                            }}
                          />
                        ) : (
                          <span className="text-2xl">🏆</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{badge.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                        {badge.earnedAt && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">No badges earned yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">
                    Complete tasks to earn your first badge!
                  </p>
                  <div className="mt-4 space-y-2 text-xs text-gray-400 dark:text-gray-500">
                    <p>🗺️ Career Mapping: Explore career paths</p>
                    <p>👨‍🏫 Mentor Session: Book a mentor session</p>
                    <p>🧠 Aptitude Test: Complete aptitude exam</p>
                  </div>
                  
                  {/* Debug section - remove in production */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-400 mb-2">Debug: Test Badge System</p>
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={async () => {
                          try {
                            const result = await badgeService.triggerAptitudeBadge();
                            console.log('Badge test result:', result);
                            if (result?.isNewBadge) {
                              await loadUserBadges();
                            }
                          } catch (error) {
                            console.error('Badge test error:', error);
                          }
                        }}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Test Aptitude
                      </button>
                      <button 
                        onClick={async () => {
                          try {
                            const result = await badgeService.triggerCareerMappingBadge();
                            console.log('Badge test result:', result);
                            if (result?.isNewBadge) {
                              await loadUserBadges();
                            }
                          } catch (error) {
                            console.error('Badge test error:', error);
                          }
                        }}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Test Career
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Completed Tasks
              </h3>
              {user?.completedTasks && user.completedTasks.length > 0 ? (
                <div className="space-y-2">
                  {user.completedTasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{task.taskName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Target className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks completed yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


