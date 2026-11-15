// استخدام الطريقة المتوافقة مع Vite للتحقق من البيئة
const API_URL = import.meta.env.MODE === 'production'
  ? '' // مسار نسبي فارغ لأن الفرونت إند والباك إند على نفس دومين Vercel
  : 'http://localhost:5000';

export const fetchLogs = async () => {
  const res = await fetch(`${API_URL}/api/logs`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
};

export const createLog = async (logData) => {
  const res = await fetch(`${API_URL}/api/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData),
  });
  if (!res.ok) throw new Error('Failed to create log');
  return res.json();
};