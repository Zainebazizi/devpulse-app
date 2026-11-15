import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bugRoutes from './routes/BugRoutes.js';
import logRoutes from './routes/logRoutes.js';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';

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

// اختبار الاتصال بقاعدة البيانات
pool.connect()
  .then(() => console.log('🚀 Connected to Supabase PostgreSQL'))
  .catch((err) => console.error('❌ Connection error:', err));

// ربط المسارات (Routes)
app.use('/api/logs', logRoutes);
app.use('/api/bugs', bugRoutes);

app.use(errorHandler); 

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// تصدير تطبيق الـ Express فقط ليعمل على Vercel Serverless Functions
export default app;