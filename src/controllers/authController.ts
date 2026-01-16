import type { Request, Response } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper to create JWT
// const createToken = (id: string) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
// };
const createToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET is missing from the .env file");
  }

  return jwt.sign({ id }, secret, { expiresIn: '1d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, skillsToTeach, skillsToLearn } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User (They automatically get 5 credits from the Model default)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      skillsToTeach,
      skillsToLearn,
      credits: 5
    });

    const token = createToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, name: user.name, credits: user.credits } });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = createToken(user._id.toString());
    res.status(200).json({ 
      token, 
      user: { id: user._id, name: user.name, credits: user.credits, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user identity" });
  }
};


export const getDashboardStats = async (req: any, res: Response) => {
  try {
    // req.user.id comes from your 'protect' middleware
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses',
        select: 'title description category instructor', // Only send necessary fields
        populate: { path: 'instructor', select: 'name' } // Populate the instructor's name
      })
      .populate('createdCourses'); // Populate full details of courses they created
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      enrolled: user.enrolledCourses,
      teaching: user.createdCourses,
      credits: user.credits // Including credits as a backup for the frontend
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};