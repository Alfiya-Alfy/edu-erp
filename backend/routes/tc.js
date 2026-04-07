const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/tc?institution_id=1
router.get('/', async (req, res, next) => {
    try {
        const { institution_id, status, search } = req.query;
        let q = 'SELECT * FROM tc WHERE institution_id = $1';
        const params = [institution_id || 1];
        let idx = 2;

        if (status) { q += ` AND status = $${idx++}`; params.push(status); }
        if (search) { q += ` AND (CAST(student_id AS TEXT) ILIKE $${idx} OR tc_number ILIKE $${idx} OR reason ILIKE $${idx})`; params.push(`%${search}%`); idx++; }

        q += ' ORDER BY issue_date DESC';
        const { rows } = await pool.query(q, params);
        res.json({ data: rows });
    } catch (err) { next(err); }
});

// POST /api/tc
router.post('/', async (req, res, next) => {
    try {
        const { student_id, institution_id, tc_number, issued_by, issue_date, reason, status } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO tc (student_id, institution_id, tc_number, issued_by, issue_date, reason, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [student_id, institution_id, tc_number, issued_by || null, issue_date, reason, status || 'pending']
        );
        res.status(201).json(rows[0]);
    } catch (err) { next(err); }
});

// PUT /api/tc/:id - Update status (pending -> issued)
router.put('/:id', async (req, res, next) => {
    try {
        const { status } = req.body;
        const { rows } = await pool.query(
            'UPDATE tc SET status = $1 WHERE tc_id = $2 RETURNING *',
            [status || 'issued', req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'TC not found' });
        res.json(rows[0]);
    } catch (err) { next(err); }
});

module.exports = router;
