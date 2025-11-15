const express = require('express');
const router = express.Router();
const monitoBot = require('../bot/monitoBot');

router.post('/', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'El campo "message" es obligatorio.' });
  }

  const reply = monitoBot.getReply(message);

  res.json({ reply });
});

module.exports = router;
