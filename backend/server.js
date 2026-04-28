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

// Student Routes
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching students' });
  }
});

// System Management Routes (Alfiya)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/institutions', require('./routes/institutionRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/merge-log', require('./routes/mergeLogRoutes'));

// Finance & Documents Routes (Amaljith)
app.use('/api/payments', require('./routes/payments'));
app.use('/api/fee-structure', require('./routes/feeStructure'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/tc', require('./routes/tc'));

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
