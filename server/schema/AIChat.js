import mongoose from 'mongoose';

const aiChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    chatType: { type: String, enum: ['mentor', 'career_guidance', 'aptitude_help', 'interview_prep', 'general'], default: 'general' },
    messages: [{
      role: { type: String, enum: ['user', 'assistant'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      metadata: {
        tokens: Number,
        responseTime: Number, // in milliseconds
        tools_used: [String],
        confidence: Number
      }
    }],
    summary: {
      totalMessages: { type: Number, default: 0 },
      topics: [String],
      insights: [String],
      actionItems: [String],
      sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] }
    },
    status: { type: String, enum: ['active', 'ended', 'archived'], default: 'active' },
    tags: [String],
    rating: { type: Number, min: 1, max: 5 },
    feedback: String
  },
  { timestamps: true }
);

export default mongoose.models.AIChat || mongoose.model('AIChat', aiChatSchema);