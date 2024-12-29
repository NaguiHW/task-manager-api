import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import {
  hasName,
  isValidPassword,
  repeatPassword,
  isUniqueEmail,
  userExists,
  hasPassword,
} from '../validators/userValidator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@ssword123
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the password
 *                 example: P@ssword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60f7b4b6b4b3f40015f6b3b3
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGY3YjRiNmI0YjNmNDAwMTVmNmIzYjMiLCJpYXQiOjE2Mjg5NjYwNzV9.1J9Q6
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: 'field'
 *                         description: The type of error
 *                       value:
 *                         type: string
 *                         example: ''
 *                         description: The value that was provided
 *                       msg:
 *                         type: string
 *                         example: 'Name is required'
 *                         description: The error message
 *                       path:
 *                         type: string
 *                         example: 'name'
 *                         description: The field that the error is related to
 *                       location:
 *                         type: string
 *                         example: 'body'
 *                         description: The location of the error
 *       404:
 *         description: Unknown error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unknown error
 *                   description: The error message
 */
router.post(
  '/register',
  hasName(),
  isUniqueEmail(),
  isValidPassword(),
  repeatPassword(),
  registerUser,
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: johndoe@example.com
 *                 format: email
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: P@ssword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60f7b4b6b4b3f40015f6b3b3
 *                   description: The user's ID
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                   description: The user's full name
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                   description: The user's email address
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGY3YjRiNmI0YjNmNDAwMTVmNmIzYjMiLCJpYXQiOjE2Mjg5NjYwNzV9.1J9Q6
 *                   description: The user's JWT token
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: 'field'
 *                         description: The type of error
 *                       value:
 *                         type: string
 *                         example: ''
 *                         description: The value that was provided
 *                       msg:
 *                         type: string
 *                         example: 'Email is required'
 *                         description: The error message
 *                       path:
 *                         type: string
 *                         example: 'email'
 *                         description: The field that the error is related to
 *                       location:
 *                         type: string
 *                         example: 'body'
 *                         description: The location of the error
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *                   description: The error message
 *       404:
 *         description: Unknown error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unknown error
 *                   description: The error message
 */
router.post('/login', userExists(), hasPassword(), loginUser);

export default router;
