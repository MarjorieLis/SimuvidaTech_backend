const express = require('express');
const Device = require('../models/Device');
const { auth } = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

// Rutas sin parámetros dinámicos (van primero)
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

// ✅ ¡Esta ruta fija debe ir ANTES de cualquier ruta con :id!
router.get('/mine', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM devices WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener dispositivos del usuario:', err);
    res.status(500).json({ error: 'Error al cargar tus dispositivos' });
  }
});

// ✅ ¡ESTA RUTA DEBE IR ANTES DE LAS RUTAS CON :id!
router.get('/admin', auth, async (req, res) => {
  try {
    // Verificar que el usuario es administrador
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    // Obtener TODOS los dispositivos de todos los usuarios
    const [rows] = await pool.execute(`
      SELECT d.*, u.email as user_email 
      FROM devices d 
      JOIN users u ON d.user_id = u.id 
      ORDER BY d.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener dispositivos para admin:', err);
    res.status(500).json({ error: 'Error al cargar los dispositivos' });
  }
});

// Rutas con parámetros dinámicos (van después)
// GET /api/devices/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }
    
    // ✅ Permitir acceso si es admin O es el dueño
    if (req.user.role === 'admin' || device.user_id === req.user.id) {
      res.json(device);
    } else {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
  } catch (err) {
    console.error('Error al obtener dispositivo:', err);
    res.status(500).json({ error: 'Error al obtener el dispositivo' });
  }
});

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

// ✅ DELETE /api/devices/:id → ¡Debe ir al FINAL de las rutas con :id!
router.delete('/:id', auth, async (req, res) => {
  try {
    const deviceId = req.params.id;
    const device = await Device.findById(deviceId);
    if (!device || device.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    // Eliminar decisiones asociadas
    await pool.execute('DELETE FROM decisions WHERE device_id = ?', [deviceId]);
    // Eliminar dispositivo
    await pool.execute('DELETE FROM devices WHERE id = ?', [deviceId]);
    res.json({ message: 'Dispositivo eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar dispositivo:', err);
    res.status(500).json({ error: 'Error al eliminar el dispositivo' });
  }
});

module.exports = router;