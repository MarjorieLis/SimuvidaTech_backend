const express = require('express');
const Device = require('../models/Device');
const { auth } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

// POST /api/devices
router.post('/', auth, async (req, res) => {
  try {
    const { type, model, year, materials } = req.body;
    if (!type || !model) {
      return res.status(400).json({ error: 'El tipo y el modelo son requeridos' });
    }
    const deviceId = await Device.create({
      userId: req.user.id,
      type,
      model,
      year: year ? parseInt(year, 10) : null,
      materials: materials || null
    });
    res.status(201).json({ id: deviceId, type, model, year, materials });
  } catch (err) {
    console.error('Error al crear dispositivo:', err);
    res.status(500).json({ error: 'Error al crear el dispositivo' });
  }
});

// GET /api/devices/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }
    if (device.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    res.json(device);
  } catch (err) {
    console.error('Error al obtener dispositivo:', err);
    res.status(500).json({ error: 'Error al obtener el dispositivo' });
  }
});

// POST /api/devices/:id/decisions
router.post('/:id/decisions', auth, async (req, res) => {
  try {
    const { stage, decision } = req.body;
    const deviceId = req.params.id;

    if (!stage || !decision) {
      return res.status(400).json({ error: 'Etapa y decisión son requeridas' });
    }

    const device = await Device.findById(deviceId);
    if (!device || device.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const [result] = await pool.execute(
      'INSERT INTO decisions (device_id, stage, decision) VALUES (?, ?, ?)',
      [deviceId, stage, decision]
    );

    res.status(201).json({ id: result.insertId, stage, decision });
  } catch (err) {
    console.error('Error al guardar decisión:', err);
    res.status(500).json({ error: 'Error al guardar la decisión' });
  }
});

// ✅ ✅ ✅ AGREGA ESTA RUTA (faltaba) ✅ ✅ ✅
// GET /api/devices/:id/decisions
router.get('/:id/decisions', auth, async (req, res) => {
  try {
    const deviceId = req.params.id;

    const device = await Device.findById(deviceId);
    if (!device || device.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM decisions WHERE device_id = ? ORDER BY created_at ASC',
      [deviceId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener decisiones:', err);
    res.status(500).json({ error: 'Error al obtener las decisiones' });
  }
});

module.exports = router;