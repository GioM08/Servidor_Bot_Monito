const intents = [
  {
    keywords: ['hola', 'buenas', 'hey'],
    reply: '¡Hola! Soy Monito 🐵 ¿En qué te puedo ayudar hoy?'
  },
  {
    keywords: ['ayuda', 'no entiendo', 'duda'],
    reply: 'Cuéntame tu duda y trataré de responderla de forma sencilla 😊'
  },
  {
    keywords: ['monito', 'proyecto', 'chatbot'],
    reply: 'Este es el chatbot Monito, un proyecto académico con servidor en Node.js y cliente en Vue.'
  }
];

function getReply(message = '') {
  const text = message.toLowerCase();

  for (const intent of intents) {
    const found = intent.keywords.some(keyword => text.includes(keyword));
    if (found) {
      return intent.reply;
    }
  }

  // Respuesta por defecto
  return 'Todavía estoy aprendiendo 🐒, ¿me puedes repetir tu pregunta con otras palabras?';
}

module.exports = { getReply };
