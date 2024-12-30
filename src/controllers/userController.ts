import { Request, Response } from 'express';
import User from '../models/userModel';
import { validationResult } from 'express-validator';
import { generateToken } from '../helpers/jwt';

export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  try {
    const { name, email, password } = req.body;

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ errors: errors.array() });
    } else {
      res.status(404).json({ message: 'Unknown error' });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isMatch = user ? await user.matchPassword(password) : false;

    if (!isMatch || !user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ errors: errors.array() });
    } else {
      res.status(404).json({ message: 'Unknown error' });
    }
  }
};
