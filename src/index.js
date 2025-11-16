const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());          
app.use(express.json()); 
app.use('/api/chat', chatRouter);  

// Servir el frontend compilado (Vue)
const clientPath = '/home/gio/Cliente_Bot_Monito/dist';
// Ajusta la ruta si tu carpeta está en otro nivel

app.use(express.static(clientPath));

app.get('/*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API de Monito está viva 🚀'
  });
});

// Rutas
app.use('/api/chat', chatRouter);

// Levantar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Monito escuchando en http://0.0.0.0:${PORT}`);
});
