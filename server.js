const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS CORREGIDO (sin errores de sintaxis)
app.use(cors({
  origin: ['http://localhost:5173', 'https://simuvida.uidehub.tech'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/devices', require('./routes/device.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/decisions', require('./routes/decision.routes')); // ✅ Decisiones de simulación
app.use('/api/deliveries', require('./routes/delivery.routes')); // ✅ Entregas QR

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor en puerto 3004 (coherente con logs anteriores)
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});