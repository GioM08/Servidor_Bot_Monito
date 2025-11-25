const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Monito API',
      version: '1.0.0',
      description: 'API del asistente Monito 🐵 con métricas y chat'
    }
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📘 Swagger listo en: http://localhost:3000/docs');
}

module.exports = swaggerDocs;

