import { TaskType } from '../types/models/taskType';

export const tasksFormatter = (tasks: TaskType[]) => {
  return tasks.map((task) => ({
    id: task._id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.createdAt,
  }));
};
