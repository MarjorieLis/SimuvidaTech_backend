const express = require('express');
const { auth } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

// ✅ GUARDAR una decisión de simulación
router.post('/device/:id', auth, async (req, res) => {
  try {
    const { stage, decision } = req.body;
    const deviceId = req.params.id;

    // Validaciones
    if (!stage || !decision) {
      return res.status(400).json({ error: 'Stage y decision son requeridos' });
    }

    // Insertar en base de datos (columnas reales: device_id, stage, decision)
    const [result] = await pool.execute(
      'INSERT INTO decisions (device_id, stage, decision) VALUES (?, ?, ?)',
      [deviceId, stage, decision]
    );

    console.log('✅ Decisión guardada:', {
      id: result.insertId,
      deviceId,
      stage,
      decision
    });

    res.status(201).json({
      id: result.insertId,
      deviceId,
      stage,
      decision
    });
  } catch (err) {
    console.error('❌ Error al guardar decisión:', err.message || err);
    res.status(500).json({
      error: 'Error al guardar decisión',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ✅ ENDPOINT PARA ADMIN — estadísticas agrupadas
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