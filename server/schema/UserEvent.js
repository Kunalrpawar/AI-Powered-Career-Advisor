import mongoose from 'mongoose';

const userEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: String, required: true, index: true }, // e.g., 'skill_analysis', 'career_explore', 'project_generate', 'job_match', 'chat'
    input: { type: Object },
    output: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.models.UserEvent || mongoose.model('UserEvent', userEventSchema);


