const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Money Tracker API',
      version: '1.0.0',
      description: 'API Documentation for Money Tracker Application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],  // Swagger akan membaca komentar dari file routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
