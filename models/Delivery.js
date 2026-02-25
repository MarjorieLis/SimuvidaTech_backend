// backend/models/Delivery.js
const pool = require('../config/db');
const crypto = require('crypto');

class Delivery {
    /**
     * Crea una nueva entrega pendiente con token QR único
     */
    static async create({ deviceId, userId }) {
        // Verificar si ya existe una entrega para este dispositivo
        const existing = await this.findByDeviceId(deviceId);
        if (existing) {
            return { id: existing.id, token: existing.token, existing: true };
        }

        const token = crypto.randomBytes(32).toString('hex');
        const [result] = await pool.execute(
            'INSERT INTO deliveries (device_id, user_id, token) VALUES (?, ?, ?)',
            [deviceId, userId, token]
        );
        return { id: result.insertId, token, existing: false };
    }

    /**
     * Busca una entrega por su token QR (con datos del dispositivo y usuario)
     */
    static async findByToken(token) {
        const [rows] = await pool.execute(
            `SELECT d.*, 
              dev.type AS device_type, dev.model AS device_model, dev.year AS device_year, dev.materials,
              u.name AS user_name, u.email AS user_email,
              adm.name AS verified_by_name
       FROM deliveries d
       JOIN devices dev ON d.device_id = dev.id
       JOIN users u ON d.user_id = u.id
       LEFT JOIN users adm ON d.verified_by = adm.id
       WHERE d.token = ?`,
            [token]
        );
        return rows[0] || null;
    }

    /**
     * Marca una entrega como verificada por un admin
     */
    static async verify(token, adminId) {
        const [result] = await pool.execute(
            `UPDATE deliveries 
       SET status = 'verified', verified_by = ?, verified_at = NOW() 
       WHERE token = ? AND status = 'pending'`,
            [adminId, token]
        );
        return result.affectedRows > 0;
    }

    /**
     * Busca la entrega asociada a un dispositivo
     */
    static async findByDeviceId(deviceId) {
        const [rows] = await pool.execute(
            'SELECT * FROM deliveries WHERE device_id = ?',
            [deviceId]
        );
        return rows[0] || null;
    }
}

module.exports = Delivery;
