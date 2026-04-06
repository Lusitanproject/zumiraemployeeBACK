import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zumira Integrations API",
      version: "1.0.0",
      description: "Documentacao detalhada dos endpoints de integrations",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT ?? "3000"}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "SUCCESS",
            },
            data: {
              nullable: true,
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ERROR",
            },
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/integrations/*.ts", "./src/routes/admin/users.routes.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
