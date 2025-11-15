const express = require('express');
const router = express.Router();
const monitoBot = require('../bot/monitoBot');

router.post('/', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El campo "message" es obligatorio.' });
  }

  try {
    const reply = await monitoBot.getReply(message, history);
    res.json({ reply });
  } catch (err) {
    console.error('Error en /api/chat:', err);
    res.status(500).json({ error: 'Error interno al procesar el mensaje.' });
  }
});

module.exports = router;
