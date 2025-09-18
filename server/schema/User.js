import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
    classStd: { type: String, default: '12' },
    academicInterests: [{ type: String }],
    badges: [{ 
      id: String,
      name: String,
      description: String,
      earnedAt: { type: Date, default: Date.now },
      category: { type: String, enum: ['aptitude', 'skill', 'career', 'project', 'interview'] }
    }],
    completedTasks: [{ 
      taskId: String,
      taskName: String,
      completedAt: { type: Date, default: Date.now }
    }],
    metadata: {
      avatar: { type: String },
      dreams: { type: String }
    },
    
    // Enhanced profile fields
    profileStats: {
      totalAptitudeTests: { type: Number, default: 0 },
      totalChatSessions: { type: Number, default: 0 },
      totalCollegeViews: { type: Number, default: 0 },
      totalResourcesViewed: { type: Number, default: 0 },
      totalScholarshipsApplied: { type: Number, default: 0 },
      totalMentorSessions: { type: Number, default: 0 },
      totalCareerMappings: { type: Number, default: 0 },
      profileCompleteness: { type: Number, default: 20 },
      lastActiveAt: { type: Date, default: Date.now },
      joinedAt: { type: Date, default: Date.now }
    },
    
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false }
      },
      privacy: {
        profileVisibility: { type: String, enum: ['public', 'private', 'limited'], default: 'limited' },
        shareProgress: { type: Boolean, default: true }
      },
      dashboard: {
        preferredView: { type: String, enum: ['detailed', 'compact'], default: 'detailed' },
        showRecommendations: { type: Boolean, default: true }
      }
    },
    
    // Quick access to latest activities
    recentActivity: {
      lastAptitudeTest: Date,
      lastChatSession: Date,
      lastCollegeView: Date,
      lastResourceAccess: Date,
      lastMentorSession: Date,
      lastCareerMapping: Date
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);


