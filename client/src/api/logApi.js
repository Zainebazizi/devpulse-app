// تحديد الـ BASE_URL ديناميكياً
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.vercel.app/api/logs' // (ضع رابط الباك إند الحقيقي هنا لاحقاً)
  : 'http://localhost:5000/api/logs';

export const fetchLogs = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
};

export const createLog = async (logData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData),
  });
  if (!res.ok) throw new Error('Failed to create log');
  return res.json();
};