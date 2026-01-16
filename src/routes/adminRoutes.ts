import express from 'express';
import { adjustCredits } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Only Superadmins/Admins can hit this
router.patch('/adjust-credits', protect, isAdmin, adjustCredits);

export default router;