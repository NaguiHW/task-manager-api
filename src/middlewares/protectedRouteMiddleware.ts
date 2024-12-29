import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = decoded.id;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default protectedRoute;