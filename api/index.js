import express from 'express';
import cors from 'cors';
import bugRoutes from '../routes/BugRoutes.js';
import logRoutes from '../routes/logRoutes.js';
import errorHandler from '../middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

// مسارات الـ API الأساسية
app.use('/logs', logRoutes);
app.use('/bugs', bugRoutes);

app.use(errorHandler);

export default app;