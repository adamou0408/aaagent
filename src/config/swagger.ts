import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AAAgent API",
      version: "1.0.0",
      description:
        "Production-ready API with Clean Architecture and automated deployment",
    },
    servers: [
      { url: "/api/v1", description: "API v1" },
    ],
  },
  apis: ["./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
