const express = require('express');
const router = express.Router();
const monitoBot = require('../bot/monitoBot');

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Envía un mensaje al bot Monito y recibe una respuesta
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hola monito"
 *                 description: Mensaje enviado por el usuario
 *               history:
 *                 type: array
 *                 description: Historial previo del chat con el bot
 *                 example: [
 *                   { "sender": "user", "message": "Hola" },
 *                   { "sender": "bot", "message": "¡Hola! ¿Cómo puedo ayudarte?" }
 *                 ]
 *     responses:
 *       200:
 *         description: Respuesta generada por el bot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *                   example: "¡Hola humano! ¿Qué tal tu día?"
 *       400:
 *         description: Petición inválida (falta 'message')
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El campo \"message\" es obligatorio."
 *       500:
 *         description: Error interno al procesar el mensaje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno al procesar el mensaje."
 */


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
