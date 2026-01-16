import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { register, login, getMe, getDashboardStats } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { session: false, failureRedirect: 'http://localhost:5173/login' }),
  (req: any, res) => {
    // Generate JWT for the user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    // Redirect back to frontend with the token
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);


export default router;