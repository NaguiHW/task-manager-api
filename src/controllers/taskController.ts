import { Request, Response } from 'express';
import Task from '../models/taskModel';
import { validationResult } from 'express-validator';
import { tasksFormatter } from '../helpers/formatters';

export const createTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  try {
    const { title, description, userId } = req.body;

    const task = new Task({
      title,
      description,
      userId,
    });

    await task.save();
    res.status(201).json({
      id: task._id,
      title: task.title,
      description: task.description,
      createdAt: task.createdAt,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ errors: errors.array() });
    } else {
      res.status(404).json({ message: 'Unknown error' });
    }
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const { userId } = req.body;
    const tasks = await Task.find()
      .where(userId)
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });

    const totalTasks = await Task.countDocuments();
    const totalPages = Math.ceil(totalTasks / limit);

    if (page > totalPages) {
      res.status(404).json({ message: 'Page not found' });
      return;
    }

    res.status(200).json({
      tasks: tasksFormatter(tasks),
      page,
      totalTasks,
      totalPages,
      limit,
    });
  } catch (_err) {
    res.status(404).json({ message: 'Unknown error' });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id).where(userId);

    if (!task) {
      return;
    }

    res.status(200).json({
      id: task._id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: 'Task not found' });
    } else {
      res.status(404).json({ message: 'Unknown error' });
    }
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { title, description, completed, userId } = req.body;
    const task = await Task.findById(req.params.id).where(userId);

    if (!task) {
      return;
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.status(200).json({
      id: task._id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: 'Task not found' });
    } else {
      res.status(404).json({ message: 'Unknown error' });
    }
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const task = await Task.deleteOne({ _id: req.params.id }).where(userId);

    if (task.deletedCount === 0) {
      return;
    }

    res.status(204).json({ message: 'Task deleted' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: 'Task not found' });
    } else {
      res.status(404).json({ message: 'Unknown error' });
    }
  }
};
