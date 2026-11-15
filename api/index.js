import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
// لاحظ استخدام ../ للرجوع للمجلد الرئيسي حيث توجد مجلدات routes و middleware
import bugRoutes from '../routes/BugRoutes.js';
import logRoutes from '../routes/logRoutes.js';
import cors from 'cors';
import errorHandler from '../middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
  .then(() => console.log('🚀 Connected to Supabase PostgreSQL'))
  .catch((err) => console.error('❌ Connection error:', err));

// دعم المسارين (مع /api وبدونه) لضمان عدم حدوث 404 نهائياً تحت أي ظرف
app.use('/api/logs', logRoutes);
app.use('/logs', logRoutes);

app.use('/api/bugs', bugRoutes);
app.use('/bugs', bugRoutes);

app.use(errorHandler);

export default app;