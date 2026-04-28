require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('EduERP API is running with PostgreSQL...');
});

// Health Check & DB Test
app.get('/api/health', async (req, res) => {
  try {
    const dbTime = await pool.query('SELECT NOW()');
    res.status(200).json({ 
      status: 'success', 
      message: 'EduERP Backend is running!',
      db_time: dbTime.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Student Routes (PostgreSQL)
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching students' });
  }
});

// System Management Routes (Alfiya) - PostgreSQL
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/institutions', require('./routes/institutionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/merge-log', require('./routes/mergeLogRoutes'));

// Finance & Documents Routes (Amaljith) - PostgreSQL
app.use('/api/payments', require('./routes/payments'));
app.use('/api/fee-structure', require('./routes/feeStructure'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/tc', require('./routes/tc'));

// --- Ashvel's Memory Storage Routes (for Attendance & Comms) ---
// Note: These are kept for functionality until migrated to PostgreSQL
let storage = {
  attendance_students: [
    { _id: '1', student_id: '1', student_name: 'Rahul Kumar', batch_id: '1', institution_id: '1', attendance_date: '2026-04-14', status: 'Present', marked_by: '1', remarks: 'On time' },
    { _id: '2', student_id: '2', student_name: 'Anjali Nair', batch_id: '2', institution_id: '2', attendance_date: '2026-04-14', status: 'Absent', marked_by: '1', remarks: 'Sick leave' }
  ],
  attendance_teachers: [
    { _id: '1', staff_id: '1', staff_name: 'Dr. Sarah Wilson', institution_id: '1', attendance_date: '2026-04-14', status: 'Present', marked_by: 'admin', remarks: 'Regular' }
  ],
  comms_logs: [
    { _id: '1', student_id: '1', communication_message: 'Daily Attendance Report Sent', type: 'sms', sent_at: '2026-04-14', status: 'delivered' }
  ]
};

const createMemoryRoutes = (modelKey, path) => {
  app.get(path, (req, res) => {
    let results = storage[modelKey];
    if (req.query.batch_id) results = results.filter(i => i.batch_id === req.query.batch_id);
    if (req.query.date) results = results.filter(i => i.attendance_date === req.query.date);
    res.json(results);
  });
  app.post(path, (req, res) => {
    const newItem = { ...req.body, _id: Date.now().toString() };
    storage[modelKey].push(newItem);
    res.json(newItem);
  });
};

createMemoryRoutes('attendance_students', '/api/attendance/students');
createMemoryRoutes('attendance_teachers', '/api/attendance/teachers');
createMemoryRoutes('comms_logs', '/api/comms-logs');
// ---------------------------------------------------------------

// Global error handler
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Port & Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
