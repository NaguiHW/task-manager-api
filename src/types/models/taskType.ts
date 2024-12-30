import { Document } from 'mongoose';

export interface TaskType extends Document {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
