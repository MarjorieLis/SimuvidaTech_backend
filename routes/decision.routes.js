const express = require('express');
const { auth } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

router.get('/admin', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const [rows] = await pool.execute(`
      SELECT stage, decision, COUNT(*) as count
      FROM decisions
      GROUP BY stage, decision
      ORDER BY stage, count DESC
    `);

    const uso = rows.filter(d => d.stage == 1).map(d => ({ name: d.decision, value: d.count }));
    const finVida = rows.filter(d => d.stage == 2).map(d => ({ name: d.decision, value: d.count }));

    res.json({ decisionesUso: uso, decisionesFinVida: finVida });
  } catch (err) {
    console.error('Error al obtener decisiones:', err);
    res.status(500).json({ error: 'Error al cargar las decisiones' });
  }
});

module.exports = router;