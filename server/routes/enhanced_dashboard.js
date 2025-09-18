import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../schema/User.js';
import UserEvent from '../schema/UserEvent.js';
import Document from '../schema/Document.js';
import AptitudeTest from '../schema/AptitudeTest.js';
import AIChat from '../schema/AIChat.js';
import CollegeInteraction from '../schema/CollegeInteraction.js';
import CareerResource from '../schema/CareerResource.js';
import ScholarshipInteraction from '../schema/ScholarshipInteraction.js';
import MentorSession from '../schema/MentorSession.js';
import CareerMapping from '../schema/CareerMapping.js';
import UserProfile from '../schema/UserProfile.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Middleware to authenticate user
function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// Enhanced dashboard stats with comprehensive data
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user with profile stats
    const user = await User.findById(userId);
    const profileStats = user?.profileStats || {};
    
    // Get detailed statistics from various collections
    const [documentsCount, aptitudeTests, aiChats, collegeInteractions, careerResources, 
           scholarshipInteractions, mentorSessions, careerMappings, userProfile, userEvents] = await Promise.all([
      Document.countDocuments({ userId }),
      AptitudeTest.find({ userId }),
      AIChat.find({ userId }),
      CollegeInteraction.find({ userId }),
      CareerResource.find({ userId }),
      ScholarshipInteraction.find({ userId }),
      MentorSession.find({ userId }),
      CareerMapping.find({ userId }),
      UserProfile.findOne({ userId }),
      UserEvent.find({ userId })
    ]);
    
    // Calculate comprehensive stats
    const stats = {
      // Core metrics for existing dashboard
      skillsAnalyzed: aptitudeTests.filter(test => test.status === 'completed').length,
      careerExplored: careerMappings.length + collegeInteractions.length,
      projectsCompleted: userProfile?.projects?.filter(p => p.status === 'completed').length || 0,
      achievements: user?.badges?.length || 0,
      documentsCount,
      
      // Detailed breakdowns for enhanced dashboard
      aptitude: {
        totalTests: aptitudeTests.length,
        completedTests: aptitudeTests.filter(test => test.status === 'completed').length,
        averageScore: aptitudeTests.length > 0 ? 
          aptitudeTests.reduce((sum, test) => sum + (test.results?.scorePercentage || 0), 0) / aptitudeTests.length : 0,
        lastTestDate: aptitudeTests.length > 0 ? 
          aptitudeTests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt : null
      },
      
      aiChat: {
        totalSessions: aiChats.length,
        totalMessages: aiChats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0),
        averageSessionLength: aiChats.length > 0 ? 
          aiChats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0) / aiChats.length : 0,
        mostUsedChatType: getMostFrequentValue(aiChats, 'chatType'),
        lastChatDate: aiChats.length > 0 ? 
          aiChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0].updatedAt : null
      },
      
      colleges: {
        totalViewed: collegeInteractions.filter(c => c.interactionType === 'viewed').length,
        totalBookmarked: collegeInteractions.filter(c => c.interactionType === 'bookmarked').length,
        totalApplied: collegeInteractions.filter(c => c.interactionType === 'applied').length,
        favoriteStates: getTopValues(collegeInteractions, 'location.state', 3)
      },
      
      resources: {
        totalViewed: careerResources.filter(r => r.interactionType === 'viewed').length,
        totalBookmarked: careerResources.filter(r => r.interactionType === 'bookmarked').length,
        totalCompleted: careerResources.filter(r => r.isCompleted).length,
        favoriteCategories: getTopValues(careerResources, 'category', 3),
        averageRating: careerResources.filter(r => r.rating).length > 0 ?
          careerResources.reduce((sum, r) => sum + (r.rating || 0), 0) / careerResources.filter(r => r.rating).length : 0
      },
      
      scholarships: {
        totalViewed: scholarshipInteractions.filter(s => s.interactionType === 'viewed').length,
        totalApplied: scholarshipInteractions.filter(s => s.interactionType === 'applied').length,
        totalBookmarked: scholarshipInteractions.filter(s => s.interactionType === 'bookmarked').length,
        approvedApplications: scholarshipInteractions.filter(s => 
          s.applicationDetails?.applicationStatus === 'approved').length
      },
      
      mentoring: {
        totalSessions: mentorSessions.length,
        completedSessions: mentorSessions.filter(s => s.status === 'completed').length,
        totalHours: mentorSessions.reduce((sum, s) => sum + (s.actualDuration || s.duration || 0), 0) / 60,
        averageRating: mentorSessions.filter(s => s.feedback?.userRating).length > 0 ?
          mentorSessions.reduce((sum, s) => sum + (s.feedback?.userRating || 0), 0) / 
          mentorSessions.filter(s => s.feedback?.userRating).length : 0,
        upcomingSessions: mentorSessions.filter(s => 
          s.status === 'scheduled' && new Date(s.scheduledAt) > new Date()).length
      },
      
      careerMapping: {
        totalMappings: careerMappings.length,
        completedPaths: careerMappings.filter(m => m.pathData?.progressPercentage === 100).length,
        averageProgress: careerMappings.length > 0 ?
          careerMappings.reduce((sum, m) => sum + (m.pathData?.progressPercentage || 0), 0) / careerMappings.length : 0,
        topCareerInterests: getTopValues(careerMappings, 'targetCareer', 3)
      },
      
      profile: {
        completeness: userProfile?.profileCompleteness?.percentage || profileStats.profileCompleteness || 20,
        totalEducationEntries: userProfile?.educationDetails?.length || 0,
        totalSkills: (userProfile?.skillsAndCertifications?.technicalSkills?.length || 0) + 
                    (userProfile?.skillsAndCertifications?.softSkills?.length || 0),
        totalProjects: userProfile?.projects?.length || 0,
        totalExperience: userProfile?.experience?.length || 0
      }
    };
    
    // Update user profile stats
    await User.findByIdAndUpdate(userId, {
      $set: {
        'profileStats.totalAptitudeTests': stats.aptitude.totalTests,
        'profileStats.totalChatSessions': stats.aiChat.totalSessions,
        'profileStats.totalCollegeViews': stats.colleges.totalViewed,
        'profileStats.totalResourcesViewed': stats.resources.totalViewed,
        'profileStats.totalScholarshipsApplied': stats.scholarships.totalApplied,
        'profileStats.totalMentorSessions': stats.mentoring.totalSessions,
        'profileStats.totalCareerMappings': stats.careerMapping.totalMappings,
        'profileStats.lastActiveAt': new Date()
      }
    });
    
    res.json(stats);
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Enhanced activities with more detailed information
router.get('/activities', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 20;
    
    // Get recent activities from various sources
    const [recentTests, recentChats, recentColleges, recentResources, 
           recentScholarships, recentSessions, recentMappings] = await Promise.all([
      AptitudeTest.find({ userId }).sort({ createdAt: -1 }).limit(3),
      AIChat.find({ userId }).sort({ updatedAt: -1 }).limit(3),
      CollegeInteraction.find({ userId }).sort({ createdAt: -1 }).limit(3),
      CareerResource.find({ userId }).sort({ createdAt: -1 }).limit(3),
      ScholarshipInteraction.find({ userId }).sort({ createdAt: -1 }).limit(3),
      MentorSession.find({ userId }).sort({ createdAt: -1 }).limit(3),
      CareerMapping.find({ userId }).sort({ createdAt: -1 }).limit(3)
    ]);
    
    // Combine and format activities
    const activities = [];
    
    recentTests.forEach(test => {
      activities.push({
        type: 'aptitude_test',
        action: `Completed ${test.testType} test`,
        time: formatTimeAgo(test.createdAt),
        timestamp: test.createdAt,
        icon: 'target',
        color: 'blue'
      });
    });
    
    recentChats.forEach(chat => {
      activities.push({
        type: 'ai_chat',
        action: `AI ${chat.chatType} session`,
        time: formatTimeAgo(chat.updatedAt),
        timestamp: chat.updatedAt,
        icon: 'message-circle',
        color: 'purple'
      });
    });
    
    recentColleges.forEach(college => {
      activities.push({
        type: 'college',
        action: `${college.interactionType} ${college.collegeName}`,
        time: formatTimeAgo(college.createdAt),
        timestamp: college.createdAt,
        icon: 'graduation-cap',
        color: 'green'
      });
    });
    
    recentResources.forEach(resource => {
      activities.push({
        type: 'resource',
        action: `${resource.interactionType} ${resource.resourceType}`,
        time: formatTimeAgo(resource.createdAt),
        timestamp: resource.createdAt,
        icon: 'book-open',
        color: 'orange'
      });
    });
    
    recentScholarships.forEach(scholarship => {
      activities.push({
        type: 'scholarship',
        action: `${scholarship.interactionType} scholarship`,
        time: formatTimeAgo(scholarship.createdAt),
        timestamp: scholarship.createdAt,
        icon: 'award',
        color: 'yellow'
      });
    });
    
    recentSessions.forEach(session => {
      activities.push({
        type: 'mentor_session',
        action: `${session.status} mentor session`,
        time: formatTimeAgo(session.createdAt),
        timestamp: session.createdAt,
        icon: 'users',
        color: 'indigo'
      });
    });
    
    recentMappings.forEach(mapping => {
      activities.push({
        type: 'career_mapping',
        action: `Explored ${mapping.targetCareer} path`,
        time: formatTimeAgo(mapping.createdAt),
        timestamp: mapping.createdAt,
        icon: 'map',
        color: 'red'
      });
    });
    
    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({ activities: activities.slice(0, limit) });
    
  } catch (error) {
    console.error('Dashboard activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get personalized recommendations
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    
    // Analyze user data to provide recommendations
    const [userProfile, recentTests, recentMappings] = await Promise.all([
      UserProfile.findOne({ userId }),
      AptitudeTest.find({ userId }).sort({ createdAt: -1 }).limit(3),
      CareerMapping.find({ userId }).sort({ createdAt: -1 }).limit(3)
    ]);
    
    const recommendations = [];
    
    // Profile completion recommendations
    if ((userProfile?.profileCompleteness?.percentage || 0) < 80) {
      recommendations.push({
        type: 'profile_completion',
        title: 'Complete Your Profile',
        description: 'Add more details to get better career recommendations',
        action: 'Go to Profile',
        priority: 'high',
        section: 'profile'
      });
    }
    
    // Aptitude test recommendations
    if (recentTests.length === 0) {
      recommendations.push({
        type: 'aptitude_test',
        title: 'Take Your First Aptitude Test',
        description: 'Discover your strengths and career interests',
        action: 'Start Test',
        priority: 'high',
        section: 'aptitude'
      });
    }
    
    // Career mapping recommendations
    if (recentMappings.length === 0) {
      recommendations.push({
        type: 'career_mapping',
        title: 'Explore Career Paths',
        description: 'Map your journey to your dream career',
        action: 'Start Mapping',
        priority: 'medium',
        section: 'mapping'
      });
    }
    
    res.json({ recommendations });
    
  } catch (error) {
    console.error('Dashboard recommendations error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Helper functions
function getMostFrequentValue(array, field) {
  const counts = {};
  array.forEach(item => {
    const value = getNestedValue(item, field);
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, null);
}

function getTopValues(array, field, limit = 3) {
  const counts = {};
  array.forEach(item => {
    const value = getNestedValue(item, field);
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([key]) => key);
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

export default router;