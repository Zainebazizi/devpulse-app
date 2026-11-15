
import express from 'express';
import cors from 'cors';

import bugRoutes from '../routes/BugRoutes.js';
import logRoutes from '../routes/logRoutes.js';
import errorHandler from '../middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DevPulse API is running!'
  });
});

app.use('/api/logs', logRoutes);
app.use('/api/bugs', bugRoutes);

app.use(errorHandler);

export default app;
