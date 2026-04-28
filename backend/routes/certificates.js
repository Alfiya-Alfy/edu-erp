const { Router } = require('express');
const pool = require('../db');
const router = Router();

// GET /api/certificates?institution_id=1
router.get('/', async (req, res, next) => {
    try {
        const { institution_id, search, type } = req.query;
        let q = 'SELECT * FROM certificates WHERE institution_id = $1';
        const params = [institution_id || 1];
        let idx = 2;

        if (type) { q += ` AND certificate_type = $${idx++}`; params.push(type); }
        if (search) { q += ` AND (CAST(student_id AS TEXT) ILIKE $${idx} OR certificate_no ILIKE $${idx})`; params.push(`%${search}%`); idx++; }

        q += ' ORDER BY issued_date DESC';
        const { rows } = await pool.query(q, params);
        res.json({ data: rows });
    } catch (err) { next(err); }
});

// GET /api/certificates/:id
router.get('/:id', async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM certificates WHERE certification_id = $1', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Certificate not found' });
        res.json(rows[0]);
    } catch (err) { next(err); }
});

// POST /api/certificates
router.post('/', async (req, res, next) => {
    try {
        const { student_id, institution_id, certificate_type, certificate_no, issued_by, issued_date, status } = req.body;
        const { rows } = await pool.query(
            `INSERT INTO certificates (student_id, institution_id, certificate_type, certificate_no, issued_by, issued_date, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [student_id, institution_id, certificate_type || 'Bonafide', certificate_no, issued_by || null, issued_date, status || 'issued']
        );
        res.status(201).json(rows[0]);
    } catch (err) { next(err); }
});

module.exports = router;
