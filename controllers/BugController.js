import pool from '../config/db.js';
import asyncHandler from '../middleware/asyncHandler.js';

// جلب جميع الـ Bugs (مع دعم البحث بالعنوان والترتيب من الأحدث للأقدم)
export const getBugs = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  let query = 'SELECT * FROM bugs';
  let queryParams = [];

  if (search) {
    query += ' WHERE title ILIKE $1';
    queryParams.push(`%${search}%`);
    query += ' ORDER BY created_at DESC';
  } else {
    query += ' ORDER BY created_at DESC';
  }

  const result = await pool.query(query, queryParams);
  res.json(result.rows);
});

// جلب Bug واحد بواسطة الـ ID
export const getBugById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM bugs WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Bug not found' });
  }
  
  res.json(result.rows[0]);
});

// إنشاء Bug جديد
export const createBug = asyncHandler(async (req, res) => {
  const { title, session, originalError, solution, rating, priority, status } = req.body;
  
  const query = `
    INSERT INTO bugs (title, session, originalError, solution, rating, priority, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *
  `;
  
  const values = [title, session, originalError, solution, rating, priority, status || 'open'];
  const result = await pool.query(query, values);
  
  res.status(201).json(result.rows[0]);
});

// تحديث Bug
export const updateBug = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, session, originalError, solution, rating, priority, status } = req.body;

  const query = `
    UPDATE bugs 
    SET title = COALESCE($1, title), 
        session = COALESCE($2, session), 
        originalError = COALESCE($3, originalError), 
        solution = COALESCE($4, solution), 
        rating = COALESCE($5, rating), 
        priority = COALESCE($6, priority), 
        status = COALESCE($7, status) 
    WHERE id = $8 
    RETURNING *
  `;

  const values = [title, session, originalError, solution, rating, priority, status, id];
  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Bug not updated or found' });
  }

  res.json(result.rows[0]);
});

// حذف Bug
export const deleteBug = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM bugs WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Bug not found' });
  }

  res.json({ message: 'Bug deleted successfully', id: req.params.id });
});