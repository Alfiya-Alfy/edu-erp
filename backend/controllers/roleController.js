// const pool = require('../db');

// Mock data based on database_setup.sql
const mockRoles = [
  { id: 1, name: 'Super Admin', description: 'Full system access', created_at: new Date().toISOString() },
  { id: 2, name: 'Institution Admin', description: 'Can manage a specific institution', created_at: new Date().toISOString() },
  { id: 3, name: 'Teacher', description: 'Can manage students and attendance', created_at: new Date().toISOString() },
  { id: 4, name: 'Student', description: 'Read-only access to own records', created_at: new Date().toISOString() }
];

const getRoles = async (req, res) => {
  try {
    // const rolesRes = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json({ success: true, data: mockRoles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newRole = {
      id: mockRoles.length + 1,
      name,
      description,
      created_at: new Date().toISOString()
    };
    res.status(201).json({ success: true, data: newRole });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getRoles, createRole };
