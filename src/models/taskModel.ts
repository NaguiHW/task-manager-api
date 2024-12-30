import mongoose, { Schema } from 'mongoose';
import { TaskType } from '../types/models/taskType';

const taskSchema = new Schema<TaskType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model<TaskType>('Task', taskSchema);

export default Task;
