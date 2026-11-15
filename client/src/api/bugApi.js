// للتحقق من البيئة باستخدام الطريقة المتوافقة مع Vite
const API_URL = import.meta.env.MODE === 'production' 
  ? '' // مسار نسبي فارغ لأن الفرونت إند والباك إند على نفس دومين Vercel
  : 'http://localhost:5000';

export const fetchBugs = async (searchQuery = '') => {
  const res = await fetch(`${API_URL}/api/bugs?search=${searchQuery}`);
  if (!res.ok) throw new Error('Failed to fetch bugs');
  return res.json();
};

export const createBug = async (bugData) => {
  const res = await fetch(`${API_URL}/api/bugs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bugData),
  });
  if (!res.ok) throw new Error('Failed to create bug');
  return res.json();
};

export const deleteBug = async (id) => {
  const res = await fetch(`${API_URL}/api/bugs/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete bug');
  return res.json();
};