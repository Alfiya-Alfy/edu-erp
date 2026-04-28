const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/fee-structure?institution_id=1
router.get('/', async (req, res, next) => {
    try {
        const { institution_id, search, course_id } = req.query;
        let q = 'SELECT * FROM fee_structure WHERE institution_id = $1';
        const params = [institution_id || 1];
        let idx = 2;

        if (course_id) { q += ` AND course_id = $${idx++}`; params.push(course_id); }
        if (search) { q += ` AND (course_id ILIKE $${idx} OR course_name ILIKE $${idx} OR academic_year ILIKE $${idx})`; params.push(`%${search}%`); idx++; }

        q += ' ORDER BY course_id, fee_type';
        const { rows } = await pool.query(q, params);
        res.json({ data: rows });
    } catch (err) { next(err); }
});

// POST /api/fee-structure
router.post('/', async (req, res, next) => {
    try {
        const { course_id, course_name, institution_id, fee_type, amount, due_date, academic_year } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO fee_structure (course_id, course_name, institution_id, fee_type, amount, due_date, academic_year)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [course_id, course_name, institution_id, fee_type || 'tuition', amount, due_date, academic_year]
        );
        res.status(201).json(rows[0]);
    } catch (err) { next(err); }
});

// PUT /api/fee-structure/:id
router.put('/:id', async (req, res, next) => {
    try {
        const { course_id, course_name, fee_type, amount, due_date, academic_year } = req.body;
        const { rows } = await pool.query(
            `UPDATE fee_structure SET course_id=$1, course_name=$2, fee_type=$3, amount=$4, due_date=$5, academic_year=$6 WHERE id=$7 RETURNING *`,
            [course_id, course_name, fee_type, amount, due_date, academic_year, req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'Fee structure not found' });
        res.json(rows[0]);
    } catch (err) { next(err); }
});

// DELETE /api/fee-structure/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const { rowCount } = await pool.query('DELETE FROM fee_structure WHERE id = $1', [req.params.id]);
        if (!rowCount) return res.status(404).json({ error: 'Fee structure not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) { next(err); }
});

module.exports = router;
