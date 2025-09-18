import mongoose from 'mongoose';

const aptitudeTestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    testType: { type: String, required: true, enum: ['personality', 'aptitude', 'skills', 'career_interest'] },
    questions: [{
      questionId: String,
      question: String,
      answer: String,
      selectedOption: String,
      isCorrect: Boolean,
      timeSpent: Number // in seconds
    }],
    results: {
      totalQuestions: { type: Number, required: true },
      correctAnswers: { type: Number, required: true },
      scorePercentage: { type: Number, required: true },
      timeTaken: { type: Number, required: true }, // in seconds
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
      careerSuggestions: [String]
    },
    status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
    completedAt: Date
  },
  { timestamps: true }
);

export default mongoose.models.AptitudeTest || mongoose.model('AptitudeTest', aptitudeTestSchema);