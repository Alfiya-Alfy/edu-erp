const pool = require('../db');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const institutionId = req.query.institutionId;

    let usersCount, rolesCount, institutionsCount;
    let recentActivity = [];

    if (institutionId && institutionId !== 'all') {
      const uRes = await pool.query('SELECT COUNT(*) FROM users WHERE institution_id = $1', [institutionId]);
      usersCount = uRes.rows[0].count;

      rolesCount = 4; // Mock role count bounded by global roles
      institutionsCount = 1;

      const actRes = await pool.query('SELECT * FROM institution_merge_log ORDER BY created_at DESC LIMIT 4');
      recentActivity = actRes.rows;
    } else {
      const uRes = await pool.query('SELECT COUNT(*) FROM users');
      usersCount = uRes.rows[0].count;

      const rRes = await pool.query('SELECT COUNT(*) FROM roles');
      rolesCount = rRes.rows[0].count;

      const iRes = await pool.query('SELECT COUNT(*) FROM institution WHERE status = $1', ['Active']);
      institutionsCount = iRes.rows[0].count;

      const actRes = await pool.query('SELECT * FROM institution_merge_log ORDER BY created_at DESC LIMIT 5');
      recentActivity = actRes.rows;
    }

    res.json({
      success: true,
      stats: [
        { label: 'Total Users', value: usersCount, change: '+5%', isUp: true },
        { label: 'Active Roles', value: rolesCount, change: '0%', isUp: true },
        { label: 'Institutions', value: institutionsCount, change: '+1', isUp: true },
      ],
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
