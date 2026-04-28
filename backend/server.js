require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

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

// Port & Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
