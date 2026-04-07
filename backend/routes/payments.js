const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/payments?institution_id=1&status=&page=1&limit=10&from=&to=
router.get('/', async (req, res, next) => {
    try {
        const { institution_id, status, page = 1, limit = 10, from, to, search } = req.query;
        let q = 'SELECT * FROM payments WHERE institution_id = $1';
        const params = [institution_id || 1];
        let idx = 2;

        if (status) { q += ` AND status = $${idx++}`; params.push(status); }
        if (from) { q += ` AND payment_date >= $${idx++}`; params.push(from); }
        if (to) { q += ` AND payment_date <= $${idx++}`; params.push(to); }
        if (search) { q += ` AND (CAST(student_id AS TEXT) ILIKE $${idx} OR transaction_id ILIKE $${idx})`; params.push(`%${search}%`); idx++; }

        q += ' ORDER BY payment_date DESC';

        const countQ = q.replace('SELECT *', 'SELECT COUNT(*)');
        const { rows: countRows } = await pool.query(countQ, params);
        const total = parseInt(countRows[0].count, 10);

        q += ` LIMIT $${idx++} OFFSET $${idx++}`;
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const { rows } = await pool.query(q, params);
        res.json({ data: rows, total, totalPages: Math.ceil(total / limit), page: parseInt(page) });
    } catch (err) { next(err); }
});

// GET /api/payments/:id
router.get('/:id', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM payments WHERE payment_id = $1', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Payment not found' });
        res.json(rows[0]);
    } catch (err) { next(err); }
});

// POST /api/payments
router.post('/', async (req, res, next) => {
    try {
        const { student_id, institution_id, received_by, amount, payment_method, transaction_id, payment_date, status } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO payments (student_id, institution_id, received_by, amount, payment_method, transaction_id, payment_date, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [student_id, institution_id, received_by || null, amount, payment_method || 'Cash', transaction_id || null, payment_date, status || 'pending']
        );
        res.status(201).json(rows[0]);
    } catch (err) { next(err); }
});

module.exports = router;
