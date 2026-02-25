// backend/routes/delivery.routes.js
const express = require('express');
const { auth } = require('../middleware/auth');
const Delivery = require('../models/Delivery');

const router = express.Router();

// ✅ Auto-crear tabla deliveries si no existe
(async () => {
    try {
        const pool = require('../config/db');
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        device_id INT NOT NULL,
        user_id INT NOT NULL,
        token VARCHAR(64) NOT NULL UNIQUE,
        status ENUM('pending', 'verified') DEFAULT 'pending',
        verified_by INT DEFAULT NULL,
        verified_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
        console.log('✅ Tabla deliveries verificada/creada');
    } catch (err) {
        console.error('⚠️ No se pudo verificar tabla deliveries:', err.message);
    }
})();

// ✅ POST /api/deliveries — Crear entrega pendiente (usuario autenticado)
router.post('/', auth, async (req, res) => {
    try {
        const { deviceId } = req.body;
        if (!deviceId) {
            return res.status(400).json({ error: 'deviceId es requerido' });
        }

        const result = await Delivery.create({
            deviceId,
            userId: req.user.id
        });

        res.status(result.existing ? 200 : 201).json({
            id: result.id,
            token: result.token,
            message: result.existing
                ? 'Ya existe una entrega para este dispositivo'
                : 'Entrega creada exitosamente'
        });
    } catch (err) {
        console.error('❌ Error al crear entrega:', err);
        res.status(500).json({ error: 'Error al crear la entrega' });
    }
});

// ✅ GET /api/deliveries/pending — Listar entregas pendientes (admin)
router.get('/pending', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const pool = require('../config/db');
        const [rows] = await pool.execute(`
            SELECT d.id, d.token, d.status, d.created_at,
                   dev.model AS device_model, dev.type AS device_type,
                   u.name AS user_name, u.email AS user_email
            FROM deliveries d
            JOIN devices dev ON d.device_id = dev.id
            JOIN users u ON d.user_id = u.id
            WHERE d.status = 'pending'
            ORDER BY d.created_at DESC
        `);

        res.json(rows);
    } catch (err) {
        console.error('❌ Error al listar entregas pendientes:', err);
        res.status(500).json({ error: 'Error al listar entregas' });
    }
});

// ✅ GET /api/deliveries/verify/:token — Obtener datos para verificación (admin)
router.get('/verify/:token', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
        }

        const delivery = await Delivery.findByToken(req.params.token);
        if (!delivery) {
            return res.status(404).json({ error: 'Entrega no encontrada o token inválido' });
        }

        res.json(delivery);
    } catch (err) {
        console.error('❌ Error al verificar entrega:', err);
        res.status(500).json({ error: 'Error al verificar la entrega' });
    }
});

// ✅ PUT /api/deliveries/verify/:token — Confirmar recepción (admin)
router.put('/verify/:token', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
        }

        const delivery = await Delivery.findByToken(req.params.token);
        if (!delivery) {
            return res.status(404).json({ error: 'Entrega no encontrada' });
        }

        if (delivery.status === 'verified') {
            return res.status(400).json({
                error: 'Esta entrega ya fue verificada',
                verified_at: delivery.verified_at,
                verified_by_name: delivery.verified_by_name
            });
        }

        const success = await Delivery.verify(req.params.token, req.user.id);
        if (!success) {
            return res.status(500).json({ error: 'No se pudo verificar la entrega' });
        }

        // Obtener datos actualizados
        const updated = await Delivery.findByToken(req.params.token);

        res.json({
            message: 'Recepción confirmada exitosamente',
            delivery: updated
        });
    } catch (err) {
        console.error('❌ Error al confirmar recepción:', err);
        res.status(500).json({ error: 'Error al confirmar la recepción' });
    }
});

// ✅ GET /api/deliveries/device/:deviceId — Estado de entrega de un dispositivo (usuario)
router.get('/device/:deviceId', auth, async (req, res) => {
    try {
        const delivery = await Delivery.findByDeviceId(req.params.deviceId);
        if (!delivery) {
            return res.status(404).json({ error: 'No hay entrega registrada para este dispositivo' });
        }

        res.json(delivery);
    } catch (err) {
        console.error('❌ Error al consultar entrega:', err);
        res.status(500).json({ error: 'Error al consultar la entrega' });
    }
});

module.exports = router;
