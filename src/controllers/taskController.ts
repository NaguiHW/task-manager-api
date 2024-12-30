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
    const completed = req.query.completed as string;
    const startIndex = (page - 1) * limit;
    const { userId } = req.body;
    const tasksQuery = Task.find({ userId: userId })
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });
    const totalTasksQuery = Task.find({ userId: userId }).countDocuments();

    switch (completed) {
      case 'true':
        tasksQuery.where({ completed: true });
        totalTasksQuery.where({ completed: true });
        break;
      case 'false':
        tasksQuery.where({ completed: false });
        totalTasksQuery.where({ completed: false });
        break;
      default:
        break;
    }

    const tasks = await tasksQuery;
    const totalTasks = await totalTasksQuery;
    const totalPages = Math.ceil(totalTasks / limit);

    if (totalTasks === 0) {
      res.status(200).json({
        tasks: [],
        page,
        totalTasks,
        totalPages,
        limit,
      });
      return;
    }

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
    const task = await Task.findById(req.params.id);

    if (!task) {
      return;
    }

    if (task.userId !== userId) {
      res.status(401).json({ message: 'Unauthorized' });
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
  const errors = validationResult(req);
  try {
    const { title, description, completed, userId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return;
    }

    if (task.userId !== userId) {
      res.status(401).json({ message: 'Unauthorized' });
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
      res.status(400).json({ errors: errors.array() });
    } else {
      res.status(404).json({ message: 'Unknown error' });
    }
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return;
    }

    if (task.userId !== userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(204).json({ message: 'Task deleted' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: 'Task not found' });
    } else {
      res.status(404).json({ message: 'Unknown error' });
    }
  }
};
