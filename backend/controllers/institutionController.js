// const pool = require('../db');

// Mock data based on database_setup.sql
const mockInstitutions = [
  {
    id: 'abc-kochi',
    name: 'ABC Academy Kochi',
    address: 'Kochi Center, Kerala',
    email: 'kochi@abcacademy.edu',
    phone: '+91 9999988888',
    status: 'Active',
    created_at: new Date().toISOString()
  },
  {
    id: 'abc-kozhy',
    name: 'ABC Academy Kozhikode',
    address: 'Kozhikode Center, Kerala',
    email: 'kozhy@abcacademy.edu',
    phone: '+91 9999977777',
    status: 'Active',
    created_at: new Date().toISOString()
  }
];

const getInstitutions = async (req, res) => {
  try {
    // Mimic database delay
    // const result = await pool.query('SELECT * FROM institution ORDER BY created_at DESC');
    res.json({ success: true, data: mockInstitutions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInstitution = async (req, res) => {
  try {
    const { id, name, address, email, phone, status } = req.body;
    const newInstitution = {
      id,
      name,
      address,
      email,
      phone,
      status: status || 'Active',
      created_at: new Date().toISOString()
    };
    
    // In mock mode, we just return the new institution as if saved
    res.status(201).json({ success: true, data: newInstitution });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getInstitutions, createInstitution };
