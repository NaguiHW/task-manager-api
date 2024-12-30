import { Response, NextFunction } from 'express';
import { UserRequest } from '../types/middlewares/appRequestType';
import jwt from 'jsonwebtoken';

const protectedRoute = (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    if (typeof decoded !== 'string' && 'id' in decoded) {
      req.body.userId = decoded.id;
    } else {
      res.status(401).json({ message: 'Invalid token payload!' });
      return;
    }

    next();
  } catch (_err) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
};

export default protectedRoute;
