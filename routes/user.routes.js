const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/stats → Solo para administradores
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const [userCount] = await pool.execute('SELECT COUNT(*) as total FROM users');
    const totalUsers = userCount[0].total;

    res.json({ totalUsers });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ error: 'Error al cargar las estadísticas' });
  }
});

// ✅ NUEVA RUTA: GET /api/users/admin → Solo para administradores
router.get('/admin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const [rows] = await pool.execute(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener usuarios para admin:', err);
    res.status(500).json({ error: 'Error al cargar los usuarios' });
  }
});

module.exports = router;