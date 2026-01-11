// backend/models/Device.js
const pool = require('../config/db');

class Device {
  static async create({ userId, type, model, year, materials }) {
    const [result] = await pool.execute(
      'INSERT INTO devices (user_id, type, model, year, materials) VALUES (?, ?, ?, ?, ?)',
      [userId, type, model, year, materials]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM devices WHERE user_id = ?', [userId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM devices WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = Device;