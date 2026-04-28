const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password, institution_id } = req.body;

  try {
    // Check for admin first
    let result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    let user = result.rows[0];
    let isSuperAdmin = false;

    if (user) {
      isSuperAdmin = true;
    } else {
      // Check normal users
      result = await pool.query('SELECT * FROM users WHERE email = $1 AND status = $2', [email, 'Active']);
      user = result.rows[0];
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Fix: Use password_hash from the schema
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Branch Verification: If not superadmin, ensure user belongs to the selected institution
    if (!isSuperAdmin && institution_id && user.institution_id !== institution_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to access this branch.' 
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role_id: user.role_id || null,
        institution_id: user.institution_id || institution_id || null,
        isSuperAdmin 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name || user.username,
        email: user.email,
        institution_id: user.institution_id || institution_id,
        role_id: user.role_id,
        isSuperAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { loginUser };
