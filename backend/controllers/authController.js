const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getRoleName = (roleId, dbRoleName) => {
  if (dbRoleName) return dbRoleName;
  switch (parseInt(roleId, 10)) {
    case 1: return 'Super Admin';
    case 2: return 'Institution Admin';
    case 3: return 'Teacher';
    case 4: return 'Student';
    default: return 'User';
  }
};

const loginUser = async (req, res) => {
  const { email, password, institution_id, role_id } = req.body;

  try {
    let user = null;

    // 1. Check users table joining roles
    const [userResult] = await sequelize.query(
      `SELECT u.*, r.role_name 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.role_id 
       WHERE u.email = :email AND LOWER(u.status) = 'active'`,
      { replacements: { email } }
    );

    user = userResult[0];

    // 2. If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or user account inactive.',
      });
    }

    // 3. Determine role & super admin status
    const effectiveRoleId = parseInt(user.role_id || role_id || 3, 10);
    const isSuperAdmin = effectiveRoleId === 1;
    const roleName = getRoleName(effectiveRoleId, user.role_name);

    // 4. Password check
    const storedPassword = user.password_hash || user.user_password;
    let isMatch = false;
    
    if (storedPassword && storedPassword.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, storedPassword);
    } else {
      isMatch = (password === storedPassword);
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 5. Institution check (if passed and not super admin)
    const cleanInstId = institution_id ? parseInt(institution_id, 10) : null;
    if (
      !isSuperAdmin &&
      cleanInstId &&
      user.institution_id &&
      parseInt(user.institution_id, 10) !== cleanInstId
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this institution branch.',
      });
    }

    // 6. JWT token
    const userId = user.user_id || user.id;
    const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_eduerp';
    const token = jwt.sign(
      {
        id: userId,
        email: user.email,
        role_id: effectiveRoleId,
        role_name: roleName,
        institution_id: user.institution_id || cleanInstId || 1,
        isSuperAdmin,
      },
      secretKey,
      { expiresIn: '30d' }
    );

    // 7. Response
    res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: user.user_name || user.name || user.username,
        email: user.email,
        institution_id: user.institution_id || cleanInstId || 1,
        role_id: effectiveRoleId,
        role: roleName,
        role_name: roleName,
        isSuperAdmin,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const signupUser = async (req, res) => {
  const { email, password, name, institution_id, role_id } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    // 1. Check if user already exists
    const [existing] = await sequelize.query(
      "SELECT user_id FROM users WHERE email = :email",
      { replacements: { email } }
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // 2. Hash password & resolve IDs
    const hashedPassword = await bcrypt.hash(password, 10);
    const resolvedRoleId = parseInt(role_id, 10) || 3; // Default to Staff/Teacher (3) if not specified
    const resolvedInstId = parseInt(institution_id, 10) || 1;

    // 3. Insert into users table
    const [result] = await sequelize.query(
      `INSERT INTO users (user_name, user_password, email, role_id, institution_id, status)
       VALUES (:user_name, :user_password, :email, :role_id, :institution_id, 'active')
       RETURNING *`,
      {
        replacements: {
          user_name: name,
          user_password: hashedPassword,
          email,
          role_id: resolvedRoleId,
          institution_id: resolvedInstId,
        },
      }
    );

    const newUser = result[0];
    const roleName = getRoleName(resolvedRoleId, null);
    const isSuperAdmin = resolvedRoleId === 1;

    // 4. Generate JWT
    const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_eduerp';
    const token = jwt.sign(
      {
        id: newUser.user_id,
        email: newUser.email,
        role_id: resolvedRoleId,
        role_name: roleName,
        institution_id: resolvedInstId,
        isSuperAdmin,
      },
      secretKey,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.user_id,
        name: newUser.user_name,
        email: newUser.email,
        institution_id: resolvedInstId,
        role_id: resolvedRoleId,
        role: roleName,
        role_name: roleName,
        isSuperAdmin,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { loginUser, signupUser };