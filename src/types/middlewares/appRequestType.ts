import { Request } from 'express';

interface AppRequestType<T> extends Request {
  body: T;
}

export type UserRequest = AppRequestType<{ userId?: string }>;
