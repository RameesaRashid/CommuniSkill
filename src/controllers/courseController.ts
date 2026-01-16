import type { Response } from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';

// 1. Mentor creates a course
export const createCourse = async (req: any, res: Response) => {
  try {
    const { title, description, category } = req.body;
    
    const newCourse = await Course.create({
      title,
      description,
      category,
      instructor: req.user.id,
      cost: 1 // Standard cost
    });

    // Update user's teaching list
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: newCourse._id }
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Error creating course" });
  }
};

// 2. Learner enrollees (The Credit Swap)
export const enrollInCourse = async (req: any, res: Response) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // CREDIT LOGIC
    if (user!.credits < 1) {
      return res.status(403).json({ message: "Insufficient credits! Teach a skill to earn more." });
    }

    // Deduct 1 credit from Learner
    user!.credits -= 1;
    user!.enrolledCourses.push(course._id as any);
    await user!.save();

    // Add Learner to Course list
    course.enrolledStudents.push(userId);
    await course.save();

    res.status(200).json({ message: "Enrolled successfully", remainingCredits: user!.credits });
  } catch (error) {
    res.status(500).json({ message: "Enrollment failed" });
  }
};

export const completeCourseSession = async (req: any, res: Response) => {
  try {
    const { courseId, learnerId } = req.body;

    // 1. Find the course to identify the Mentor (Instructor)
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // 2. Logic: The Mentor (Instructor) earns 2 credits for teaching 
    const mentorId = course.instructor;

    await User.findByIdAndUpdate(mentorId, { 
      $inc: { credits: 2 } 
    });

    res.status(200).json({ 
      message: "Course completed! Mentor has been rewarded with 2 credits." 
    });
  } catch (error) {
    res.status(500).json({ message: "Error during completion reward logic" });
  }
};

export const getAllCourses = async (req: any, res: Response) => {
  try {
    // Find all courses except those where the user is the instructor
    const courses = await Course.find({ 
      instructor: { $ne: req.user.id } 
    }).populate('instructor', 'name');
    
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

export const getCourseById = async (req: any, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email'); // Get mentor info
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details" });
  }
};
