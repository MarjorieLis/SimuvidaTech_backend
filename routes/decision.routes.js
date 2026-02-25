const express = require('express');
const { auth } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

// ✅ Auto-crear tabla decisions si no existe
(async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS decisions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        device_id INT NOT NULL,
        stage TINYINT NOT NULL,
        decision VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla decisions verificada/creada');
  } catch (err) {
    console.error('⚠️ No se pudo verificar tabla decisions:', err.message);
  }
})();

// ✅ GUARDAR una decisión de simulación
router.post('/device/:id', auth, async (req, res) => {
  try {
    const { stage, decision } = req.body;
    const deviceId = req.params.id;

    if (!stage || !decision) {
      return res.status(400).json({ error: 'Stage y decision son requeridos' });
    }

    const [result] = await pool.execute(
      'INSERT INTO decisions (device_id, stage, decision) VALUES (?, ?, ?)',
      [deviceId, stage, decision]
    );

    console.log('✅ Decisión guardada:', { id: result.insertId, deviceId, stage, decision });

    res.status(201).json({ id: result.insertId, deviceId, stage, decision });
  } catch (err) {
    console.error('❌ Error al guardar decisión:', err.message || err);
    res.status(500).json({ error: 'Error al guardar decisión' });
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

    console.log('📊 Decisiones encontradas:', rows.length, 'registros');

    const uso = rows.filter(d => d.stage == 1).map(d => ({ name: d.decision, value: d.count }));
    const finVida = rows.filter(d => d.stage == 2).map(d => ({ name: d.decision, value: d.count }));

    res.json({ decisionesUso: uso, decisionesFinVida: finVida });
  } catch (err) {
    console.error('❌ Error al obtener decisiones:', err.message);
    // Si la tabla no existe, devolver vacío en vez de error
    if (err.message && err.message.includes("doesn't exist")) {
      return res.json({ decisionesUso: [], decisionesFinVida: [] });
    }
    res.status(500).json({ error: 'Error al cargar las decisiones' });
  }
});

module.exports = router;