import pool from '../config/db.js'; // اتصال Supabase

// جلب السجلات
export const getLogs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// إنشاء سجل جديد
export const createLog = async (req, res) => {
  try {
    const { title, level, message, hours } = req.body;
    const query = `
      INSERT INTO logs (title, level, message, hours) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [title, level || 'info', message, hours || 0];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};