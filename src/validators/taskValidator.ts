import { body } from 'express-validator';

export const hasTitle = () => body('title').trim().notEmpty();
