import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    
    personalInfo: {
      profilePicture: String,
      phoneNumber: String,
      location: {
        city: String,
        state: String,
        country: { type: String, default: 'India' },
        pincode: String
      },
      languages: [String],
      socialMedia: {
        linkedin: String,
        github: String,
        twitter: String,
        portfolio: String
      }
    },
    
    educationDetails: [{
      institution: String,
      degree: String,
      field: String,
      startYear: Number,
      endYear: Number,
      grade: String,
      percentage: Number,
      achievements: [String],
      isCurrentlyStudying: { type: Boolean, default: false }
    }],
    
    skillsAndCertifications: {
      technicalSkills: [{
        skill: String,
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
        yearsOfExperience: Number,
        certifications: [String]
      }],
      softSkills: [{
        skill: String,
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
      }],
      languages: [{
        language: String,
        proficiency: { type: String, enum: ['basic', 'intermediate', 'fluent', 'native'] }
      }]
    },
    
    careerPreferences: {
      interestedIndustries: [String],
      preferredJobRoles: [String],
      workPreference: { type: String, enum: ['remote', 'onsite', 'hybrid', 'flexible'] },
      salaryExpectation: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'INR' }
      },
      preferredLocations: [String],
      careerGoals: [String],
      willingToRelocate: { type: Boolean, default: false }
    },
    
    experience: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      isCurrentJob: { type: Boolean, default: false },
      description: String,
      skills_used: [String],
      achievements: [String]
    }],
    
    projects: [{
      title: String,
      description: String,
      technologies: [String],
      githubLink: String,
      liveLink: String,
      startDate: Date,
      endDate: Date,
      status: { type: String, enum: ['completed', 'in_progress', 'planned'] }
    }],
    
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      profileVisibility: { type: String, enum: ['public', 'private', 'limited'], default: 'limited' },
      jobAlerts: { type: Boolean, default: true },
      mentorshipAvailability: { type: Boolean, default: false }
    },
    
    profileCompleteness: {
      percentage: { type: Number, default: 0 },
      missingFields: [String],
      lastCalculated: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

export default mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);