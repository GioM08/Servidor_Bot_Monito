const COMPANY_CONTEXT = `
Eres Monito, asistente virtual de la empresa MONITO S.A.
La empresa se dedica a vender playeras personalizadas.
Tu forma de responder:
- Siempre en español.
- Tono amigable, claro y corto.
- Das información sobre productos, horarios, formas de contacto y dudas frecuentes.
- Si algo no está en la información de la empresa, respondes de forma general y pides más detalles.
`;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const faqs = require('../data/faqs.json');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


function normalizeText(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// ---------- FAQs ----------

function getFaqScore(faq, normalizedMessage) {
  const base = faq.question + ' ' + (faq.keywords || []).join(' ');
  const normalizedFaq = normalizeText(base);
  const words = normalizedFaq.split(/\s+/);

  let score = 0;
  for (const w of words) {
    if (!w) continue;
    if (normalizedMessage.includes(w)) score++;
  }
  return score;
}

function findBestFaq(normalizedMessage) {
  let bestFaq = null;
  let bestScore = 0;

  for (const faq of faqs) {
    const score = getFaqScore(faq, normalizedMessage);
    if (score > bestScore) {
      bestScore = score;
      bestFaq = faq;
    }
  }


  if (bestFaq && bestScore >= 2) return bestFaq;
  return null;
}



const intents = [
  {
    name: 'saludo',
    keywords: ['hola', 'buenas', 'que onda', 'hey'],
    replies: [
      '¡Hola! Soy Monito 🐵 ¿en qué te puedo ayudar hoy?',
      '¡Hey! 🐒 Aquí Monito, listo para orientarte.',
      '¡Hola, hola! ¿Qué te gustaría saber? 😊'
    ]
  },
  {
    name: 'despedida',
    keywords: ['adios', 'gracias', 'nos vemos', 'hasta luego'],
    replies: [
      '¡Gracias por escribir! 🐵',
      '¡Nos vemos! Cualquier cosa, aquí estaré 👋',
      'Fue un gusto ayudarte 😊'
    ]
  }

];

function getIntentReply(normalizedMessage) {
  for (const intent of intents) {
    const found = intent.keywords.some(kw =>
      normalizedMessage.includes(normalizeText(kw))
    );

    if (found) {
      const idx = Math.floor(Math.random() * intent.replies.length);
      return intent.replies[idx];
    }
  }
  return null;
}

// ---------- Llamada a Google Gemini ----------

async function getGeminiReply(message) {
  const systemInstructions = `
Eres Monito, un asistente virtual amable y claro.
Respondes en español, de forma breve pero útil.
Puedes orientar al usuario sobre la empresa, procesos, servicios u otros temas generales.
Si no sabes algo, dilo con honestidad y pide más contexto.
`;

  const prompt = `
${systemInstructions}

Pregunta del usuario:
${message}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return text || 'Lo siento, tuve un problema al generar la respuesta 🤖';
}

// ---------- Función principal usada por la ruta /api/chat ----------

async function getReply(message = '', history = []) {
  const normalized = normalizeText(message);

  // 1) FAQs
  const faq = findBestFaq(normalized);
  if (faq) return faq.answer;

  // 2) Intents
  const intentReply = getIntentReply(normalized);
  if (intentReply) return intentReply;

  // 3) Gemini con contexto + historial
  try {
    const iaReply = await getGeminiReply(message, history);
    return iaReply;
  } catch (err) {
    console.error('Error llamando a Gemini:', err);
    return 'Por ahora no puedo usar la IA, pero seguiré aprendiendo 🐵. Intenta preguntar de otra forma o contáctanos por otro medio.';
  }
}

async function getGeminiReply(message, history = []) {
  
  const historyText = history
    .map(h => {
      if (!h || !h.content) return '';
      return h.role === 'user'
        ? `Usuario: ${h.content}`
        : `Monito: ${h.content}`;
    })
    .join('\n');

  const prompt = `
[Contexto de la empresa]
${COMPANY_CONTEXT}

[Historial reciente de la conversación]
${historyText || '(sin mensajes previos)'}

[Mensaje actual del usuario]
Usuario: ${message}

Instrucciones para Monito:
- Responde solo en español.
- Mantén coherencia con el historial.
- Si el usuario hace referencia a algo ya mencionado, respóndelo tomando en cuenta el contexto previo.
- Si la pregunta es sobre la empresa, productos o servicios, responde como asistente oficial.
- Si no sabes algo, dilo con honestidad y pide más detalles.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}


module.exports = { getReply };
