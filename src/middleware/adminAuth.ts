import type { Response, NextFunction } from 'express';

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};