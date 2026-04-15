import swaggerJSDoc from "swagger-jsdoc";

const isDistRuntime = __dirname.includes("/dist/");

const docsBaseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT ?? "3000"}`;

const apis = isDistRuntime
  ? ["./dist/routes/integrations/*.js", "./dist/routes/admin/users.routes.js", "./dist/routes/auth.routes.js"]
  : ["./src/routes/integrations/*.ts", "./src/routes/admin/users.routes.ts", "./src/routes/auth.routes.ts"];

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
        url: docsBaseUrl,
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
  apis,
};

export const swaggerSpec = swaggerJSDoc(options);
