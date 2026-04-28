// const pool = require('../db');
// const bcrypt = require('bcryptjs');

// Mock data based on database_setup.sql
const mockUsers = [
  {
    id: 1,
    name: 'Kochi Admin User',
    email: 'admin@kochi.com',
    status: 'Active',
    institution_id: 'abc-kochi',
    institution_name: 'ABC Academy Kochi',
    role_id: 2,
    role_name: 'Institution Admin',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'John Teacher',
    email: 'john@kochi.com',
    status: 'Active',
    institution_id: 'abc-kochi',
    institution_name: 'ABC Academy Kochi',
    role_id: 3,
    role_name: 'Teacher',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Kozhy Admin User',
    email: 'admin@kozhy.com',
    status: 'Active',
    institution_id: 'abc-kozhy',
    institution_name: 'ABC Academy Kozhikode',
    role_id: 2,
    role_name: 'Institution Admin',
    created_at: new Date().toISOString()
  }
];

const getUsers = async (req, res) => {
  try {
    // res.json({ success: true, data: result.rows });
    res.json({ success: true, data: mockUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, institution_id, role_id, status } = req.body;
    
    const newUser = {
      id: Math.floor(Math.random() * 1000) + 10,
      name,
      email,
      status: status || 'Active',
      institution_id,
      institution_name: 'Mock Institution',
      role_id,
      role_name: 'Staff',
      created_at: new Date().toISOString()
    };

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser };
