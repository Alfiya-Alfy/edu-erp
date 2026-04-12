// const pool = require('../db');

// Mock data based on database_setup.sql
const mockMergeLogs = [
  { id: 1, action: 'System Initialization', status: 'Success', details: 'Created initial tables and admin account.', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, action: 'Add Branch Kochi', status: 'Success', details: 'Data imported successfully.', created_at: new Date(Date.now() - 43200000).toISOString() },
  { id: 3, action: 'Add Branch Kozhikode', status: 'Success', details: 'Data imported successfully.', created_at: new Date().toISOString() }
];

// @desc    Get all merge logs
// @route   GET /api/merge-log
const getMergeLogs = async (req, res) => {
  try {
    // const result = await pool.query('SELECT * FROM institution_merge_log');
    res.status(200).json({ success: true, count: mockMergeLogs.length, data: mockMergeLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new merge log entry
// @route   POST /api/merge-log
const createMergeLog = async (req, res) => {
  try {
    const { action, status, details } = req.body; 
    
    const newLog = {
      id: mockMergeLogs.length + 1,
      action,
      status,
      details,
      created_at: new Date().toISOString()
    };
    
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getMergeLogs, createMergeLog };
