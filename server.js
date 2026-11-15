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

// تمرير الـ pool للـ routes إذا أردت استخدامها، أو اعتمادها عبر استيرادها
app.use('/api/logs', logRoutes);
app.use('/api/bugs', bugRoutes);

app.use(errorHandler); 

const PORT = process.env.PORT || 5000;

// تشغيل السيرفر ليستمع للطلبات على المنفذ المناسب للاستضافة
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default pool;