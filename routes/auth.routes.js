const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    
    // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // Verificar si ya existe el usuario
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Determinar rol
    let role = 'user';
    const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE;
    
    if (adminCode && ADMIN_SECRET_CODE && adminCode === ADMIN_SECRET_CODE) {
      role = 'admin';
    }

    // Crear usuario
    const userId = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await User.comparePassword(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;