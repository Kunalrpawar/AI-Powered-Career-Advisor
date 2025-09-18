import mongoose from 'mongoose';

const mentorSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mentorId: { type: String, required: true, index: true },
    mentorName: String,
    mentorExpertise: [String],
    sessionType: { 
      type: String, 
      enum: ['video_call', 'audio_call', 'chat', 'group_session', 'workshop'], 
      required: true 
    },
    topic: { type: String, required: true },
    description: String,
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    actualDuration: Number, // actual session duration
    status: { 
      type: String, 
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'], 
      default: 'scheduled' 
    },
    meetingDetails: {
      platform: { type: String, enum: ['zoom', 'google_meet', 'teams', 'webrtc'] },
      meetingId: String,
      meetingLink: String,
      recordingLink: String
    },
    goals: [String],
    outcomes: [String],
    actionItems: [String],
    resources_shared: [String],
    feedback: {
      userRating: { type: Number, min: 1, max: 5 },
      mentorRating: { type: Number, min: 1, max: 5 },
      userFeedback: String,
      mentorFeedback: String
    },
    notes: String,
    tags: [String],
    nextSessionSuggested: Date,
    followUpRequired: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.MentorSession || mongoose.model('MentorSession', mentorSessionSchema);