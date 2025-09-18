import mongoose from 'mongoose';

const scholarshipInteractionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    scholarshipId: { type: String, required: true, index: true },
    scholarshipName: { type: String, required: true },
    provider: String, // Government/Organization providing the scholarship
    state: String,
    category: { type: String, enum: ['merit', 'need_based', 'minority', 'sports', 'arts', 'research'] },
    amount: {
      value: Number,
      currency: { type: String, default: 'INR' },
      type: { type: String, enum: ['full', 'partial', 'monthly', 'one_time'] }
    },
    interactionType: { 
      type: String, 
      enum: ['viewed', 'bookmarked', 'applied', 'eligible_check', 'shared'], 
      required: true 
    },
    eligibility: {
      meetsRequirements: Boolean,
      checkedCriteria: [String],
      missingRequirements: [String]
    },
    applicationDetails: {
      applicationDeadline: Date,
      documentsRequired: [String],
      applicationStatus: { 
        type: String, 
        enum: ['not_applied', 'draft', 'submitted', 'under_review', 'approved', 'rejected'] 
      },
      appliedAt: Date,
      resultAt: Date
    },
    priority: { type: Number, min: 1, max: 5, default: 3 },
    notes: String,
    reminders: [{
      type: { type: String, enum: ['deadline', 'document', 'follow_up'] },
      date: Date,
      message: String,
      completed: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.ScholarshipInteraction || mongoose.model('ScholarshipInteraction', scholarshipInteractionSchema);