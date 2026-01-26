import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import discoveryRoutes from './routes/discoveryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import cors from 'cors';
import mongoose from "mongoose";

const app = express();
app.use(express.json()); 


app.use(cors({
  origin: "https://your-project-name.vercel.app", // Your Vite Frontend Address
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/admin', adminRoutes); // This matches your frontend calls
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/discovery', discoveryRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ CommuniSkill Database Connected"))
  .catch((err) => console.log("❌ Connection Error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});