import type { Request, Response } from 'express';
import User from '../models/User.js';

export const adjustCredits = async (req: Request, res: Response) => {
  try {
    const { userId, amount, reason } = req.body; // reason for audit logs
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { $inc: { credits: amount } }, 
      { new: true }
    );

    res.status(200).json({ 
      message: `Credits adjusted for ${user?.name}. Reason: ${reason}`,
      newBalance: user?.credits 
    });
  } catch (error) {
    res.status(500).json({ message: "Admin credit adjustment failed" });
  }
};