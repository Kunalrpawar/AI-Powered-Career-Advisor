import mongoose from 'mongoose';

const collegeInteractionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    collegeId: { type: String, required: true, index: true },
    collegeName: { type: String, required: true },
    location: {
      state: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    interactionType: { 
      type: String, 
      enum: ['viewed', 'bookmarked', 'applied', 'inquired', 'visited', 'compared'], 
      required: true 
    },
    details: {
      courseInterest: [String],
      programLevel: { type: String, enum: ['undergraduate', 'postgraduate', 'diploma', 'certificate'] },
      fees: {
        amount: Number,
        currency: { type: String, default: 'INR' }
      },
      applicationDeadline: Date,
      notes: String
    },
    status: { 
      type: String, 
      enum: ['interested', 'applied', 'accepted', 'rejected', 'waitlisted', 'enrolled'], 
      default: 'interested' 
    },
    priority: { type: Number, min: 1, max: 5, default: 3 }
  },
  { timestamps: true }
);

export default mongoose.models.CollegeInteraction || mongoose.model('CollegeInteraction', collegeInteractionSchema);