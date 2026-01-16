import express from 'express';
import { register, login, getMe, getDashboardStats } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/dashboard-stats', protect, getDashboardStats);


export default router;