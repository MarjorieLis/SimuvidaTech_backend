// backend/server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes'); // ← Añade esta línea

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes); // ← Añade esta línea

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));