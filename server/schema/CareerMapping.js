import mongoose from 'mongoose';

const careerMappingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mappingType: { 
      type: String, 
      enum: ['career_path', 'skill_roadmap', 'education_timeline', 'job_market_analysis'], 
      required: true 
    },
    targetCareer: { type: String, required: true },
    currentLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    timelineGoal: { type: String, enum: ['6_months', '1_year', '2_years', '5_years'] },
    
    pathData: {
      steps: [{
        stepNumber: Number,
        title: String,
        description: String,
        estimatedDuration: String,
        skills_required: [String],
        resources: [String],
        milestones: [String],
        isCompleted: { type: Boolean, default: false },
        completedAt: Date
      }],
      currentStep: { type: Number, default: 1 },
      progressPercentage: { type: Number, default: 0 }
    },
    
    skillGaps: [{
      skill: String,
      currentLevel: { type: String, enum: ['none', 'basic', 'intermediate', 'advanced'] },
      targetLevel: { type: String, enum: ['basic', 'intermediate', 'advanced', 'expert'] },
      priority: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      recommendedCourses: [String],
      estimatedTimeToAcquire: String
    }],
    
    marketInsights: {
      demandLevel: { type: String, enum: ['low', 'medium', 'high', 'very_high'] },
      averageSalary: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'INR' }
      },
      growthProjection: String,
      topCompanies: [String],
      topLocations: [String],
      trendsAnalysis: String
    },
    
    personalizedRecommendations: [String],
    lastUpdated: { type: Date, default: Date.now },
    isBookmarked: { type: Boolean, default: false },
    notes: String,
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.models.CareerMapping || mongoose.model('CareerMapping', careerMappingSchema);