const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const chatRouter = require('./routes/chat');
const swaggerDocs = require('./swagger');


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ================== RUTAS DE API ==================

// Ruta de prueba para la API
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API de Monito está viva 🚀'
  });
});

swaggerDocs(app);


// Ruta del chatbot
app.use('/api/chat', chatRouter);

// ================== FRONTEND (VUE BUILD) ==================

// Ruta al dist de tu cliente
const clientPath = '/home/gio/Cliente_Bot_Monito/dist';


app.use(express.static(clientPath));


app.use((req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// ================== LEVANTAR SERVIDOR ==================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Monito escuchando en http://0.0.0.0:${PORT}`);
});
