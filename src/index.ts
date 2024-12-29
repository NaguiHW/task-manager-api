import express from 'express';
import dotenv from 'dotenv';
import db from './config/db';
import userRoutes from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

dotenv.config();
db();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/api', userRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log('Server is running on port:', PORT);
});
