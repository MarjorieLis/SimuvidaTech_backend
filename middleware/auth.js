// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByEmail(decoded.email); // ← ¡Asegúrate de que User.findByEmail exista!
    
    if (!user) return res.status(401).json({ error: 'Usuario no válido' });

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ✅ Exporta un objeto con la función auth
module.exports = { auth };