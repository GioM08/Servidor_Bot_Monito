const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());          
app.use(express.json());   

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
app.listen(PORT, () => {
  console.log(`Servidor Monito escuchando en el puerto ${PORT}`);
});
