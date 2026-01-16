import express from 'express';
import { createCourse, enrollInCourse, getAllCourses, getCourseById } from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';
import { completeCourseSession } from '../controllers/courseController.js';

const router = express.Router();

// Both routes are PROTECTED (User must be logged in)
router.post('/create', protect, createCourse);
router.post('/enroll/:id', protect, enrollInCourse);
router.get('/:id', protect, getCourseById);
// This route triggers the 'Teaching' reward logic 
router.post('/complete/:id', protect, completeCourseSession);
router.get('/all', protect, getAllCourses);

export default router;