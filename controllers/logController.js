import pool from '../server.js';
import asyncHandler from '../middleware/asyncHandler.js';

// جلب جميع الـ Logs مرتبة من الأحدث للأقدم
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
    
    const values = [title, level, message, hours];
    const result = await pool.query(query, values);
    
    res.status(201).json(result.rows[0]);
});

// تحديث Log
export const updateLog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, level, message, hours } = req.body;

    const query = `
        UPDATE logs 
        SET title = COALESCE($1, title), 
            level = COALESCE($2, level), 
            message = COALESCE($3, message), 
            hours = COALESCE($4, hours) 
        WHERE id = $5 
        RETURNING *
    `;

    const values = [title, level, message, hours, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Log not found' });
    }

    res.json(result.rows[0]);
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