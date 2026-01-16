import mongoose, { Schema } from 'mongoose';


const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // The Credit Economy: Everyone starts with 5
  credits: { type: Number, default: 5 },

  // Role Management
  // Default is 'user', but can be updated to 'admin' or 'superadmin' by DB owner
  role: { 
    type: String, 
    enum: ['user', 'admin', 'superadmin'], 
    default: 'user' 
  },

  // Skill Barter Data
  skillsToTeach: [{
    skillName: String,
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'] }
  }],
  skillsToLearn: [String],

  // Udemy-style tracking
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  createdCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);