const bcrypt = require('bcryptjs');
const pool = require('../config/db');

class User {
  // ✅ Añade 'role' como parámetro con valor por defecto
  static async create({ name, email, password, role = 'user' }) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = User;