import mongoose from 'mongoose';

const careerResourceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    resourceType: { type: String, enum: ['video', 'article', 'course', 'webinar', 'tool'], required: true },
    title: { type: String, required: true },
    url: String,
    category: { type: String, enum: ['career_guidance', 'skill_development', 'interview_prep', 'industry_insights', 'education'] },
    interactionType: { 
      type: String, 
      enum: ['viewed', 'bookmarked', 'completed', 'shared', 'rated'], 
      required: true 
    },
    progress: {
      watchTime: Number, // in seconds for videos
      completionPercentage: { type: Number, min: 0, max: 100 },
      lastPosition: Number // for resuming content
    },
    rating: { type: Number, min: 1, max: 5 },
    notes: String,
    tags: [String],
    isCompleted: { type: Boolean, default: false },
    completedAt: Date
  },
  { timestamps: true }
);

export default mongoose.models.CareerResource || mongoose.model('CareerResource', careerResourceSchema);