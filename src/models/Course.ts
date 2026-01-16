import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "Programming", "Cooking"
  
  // The Mentor
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Udemy-style Content
  modules: [{
    title: String,
    contentUrl: String, // Link to video or document
  }],

  // Enrollment Tracking
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
  // Credit Value (Fixed for our Barter System)
  cost: { type: Number, default: 1 },
  
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', CourseSchema);