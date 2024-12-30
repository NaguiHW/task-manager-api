import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import db from './config/db';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import protectedRoute from './middlewares/protectedRouteMiddleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import cors from 'cors';

db();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api', userRoutes);
app.use('/api', protectedRoute, taskRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log('Server is running on port:', PORT);
});
