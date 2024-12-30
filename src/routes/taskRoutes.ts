import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from '../controllers/taskController';
import { hasTitle } from '../validators/taskValidator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: Bearer token
 *           description: The authorization token
 *           required: true
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 60f7b4b6b4b3f40015f6b3b3
 *                         description: Task ID
 *                       title:
 *                         type: string
 *                         example: Buy groceries
 *                         description: Task title
 *                       description:
 *                         type: string
 *                         example: Buy milk, eggs, and bread
 *                         description: Task description
 *                       completed:
 *                         type: boolean
 *                         example: false
 *                         description: Task completion status
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2021-07-21T00:00:00.000Z
 *                 page:
 *                   type: integer
 *                   example: 1
 *                   description: Current page number
 *                 totalTasks:
 *                   type: integer
 *                   example: 10
 *                   description: Total number of tasks
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                   description: Total number of pages
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                   description: Number of tasks per page
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
 *                   enum: [Unknown error, Page not found]
 */
router.get('/tasks', getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7b4b6b4b3f40015f6b3b3
 *           description: Task ID
 *           required: true
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: Bearer token
 *           description: The authorization token
 *           required: true
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 60f7b4b6b4b3f40015f6b3b3
 *                   description: Task ID
 *                 title:
 *                   type: string
 *                   example: Buy groceries
 *                   description: Task title
 *                 description:
 *                   type: string
 *                   example: Buy milk, eggs, and bread
 *                   description: Task description
 *                 completed:
 *                   type: boolean
 *                   example: false
 *                   description: Task completion status
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2021-07-21T00:00:00.000Z
 *       400:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task not found
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
 *                   enum: [Unknown error, Task not found]
 */
router.get('/tasks/:id', getTask);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: Bearer token
 *           description: The authorization token
 *           required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *                 example: Buy groceries
 *               description:
 *                 type: string
 *                 description: Task description
 *                 example: Buy milk, eggs, and bread
 *               userId:
 *                 type: string
 *                 description: User ID
 *                 example: 60f7b4b6b4b3f40015f6b3b3
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 60f7b4b6b4b3f40015f6b3b3
 *                 title:
 *                   type: string
 *                   example: Buy groceries
 *                 description:
 *                   type: string
 *                   example: Buy milk, eggs, and bread
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2021-07-21T00:00:00.000Z
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
 *                         example: field
 *                         description: The type of error
 *                       value:
 *                         type: string
 *                         example: ''
 *                         description: The value of the field
 *                       msg:
 *                         type: string
 *                         example: Title is required
 *                         description: The error message
 *                       path:
 *                         type: string
 *                         example: title
 *                         description: The field that the error is related to
 *                       location:
 *                         type: string
 *                         example: body
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
router.post('/tasks', hasTitle(), createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7b4b6b4b3f40015f6b3b3
 *           description: Task ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: Bearer token
 *           description: The authorization token
 *           required: true
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 60f7b4b6b4b3f40015f6b3b3
 *                   description: Task ID
 *                 title:
 *                   type: string
 *                   example: Buy groceries
 *                   description: Task title
 *                 description:
 *                   type: string
 *                   example: Buy milk, eggs, and bread
 *                   description: Task description
 *                 completed:
 *                   type: boolean
 *                   example: false
 *                   description: Task completion status
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2021-07-21T00:00:00.000Z
 *       400:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task not found
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
 *                   enum: [Unknown error, Task not found]
 */
router.put('/tasks/:id', updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           example: 60f7b4b6b4b3f40015f6b3b3
 *           description: Task ID
 *           required: true
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: Bearer token
 *           description: The authorization token
 *           required: true
 *     responses:
 *       204:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted
 *                   description: The success message
 *       400:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task not found
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
router.delete('/tasks/:id', deleteTask);

export default router;
