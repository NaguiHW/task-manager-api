import { body } from 'express-validator';
import User from '../models/userModel';

export const hasName = () => body('name').trim().notEmpty();

export const isUniqueEmail = () =>
  body('email')
    .trim()
    .isEmail()
    .custom(async (email: string) => {
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error('User already exists');
      }
    });

export const userExists = () =>
  body('email')
    .trim()
    .isEmail()
    .custom(async (email: string) => {
      const userExists = await User.findOne({ email });
      if (!userExists) {
        throw new Error('Invalid email or password');
      }
    });

export const hasPassword = () => body('password').notEmpty();

export const isValidPassword = () =>
  body('password').trim().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

export const repeatPassword = () =>
  body('repeatPassword').custom((repeatPassword, { req }) => {
    if (repeatPassword !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  });
