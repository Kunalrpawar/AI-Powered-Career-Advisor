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
    }]
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);


