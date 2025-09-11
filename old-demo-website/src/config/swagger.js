import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crape-jeah-Pornthip API",
      version: "1.0.0",
      description: "API documentation for Crape-jeah-Pornthip demo-website",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API docs in JSDoc format
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
