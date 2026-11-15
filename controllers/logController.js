import pool from '../config/db.js'; // أو '../server.js' حسب مكان الـ pool لديك
import asyncHandler from '../middleware/asyncHandler.js';

// جلب جميع الـ Logs (ترتيب من الأحدث للأقدم)
export const getLogs = asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM logs ORDER BY created_at DESC');
  res.json(result.rows);
});

// جلب Log واحد بواسطة الـ ID
export const getLogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM logs WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Log not found' });
  }
  
  res.json(result.rows[0]);
});

// إنشاء Log جديد
export const createLog = asyncHandler(async (req, res) => {
  const { title, level, message, hours } = req.body;
  
  const query = `
    INSERT INTO logs (title, level, message, hours) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  
  const values = [title, level || 'info', message, hours || 0];
  const result = await pool.query(query, values);
  
  res.status(201).json(result.rows[0]);
});

// حذف Log
export const deleteLog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM logs WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Log not found' });
  }

  res.json({ message: 'Log deleted successfully', id: req.params.id });
});