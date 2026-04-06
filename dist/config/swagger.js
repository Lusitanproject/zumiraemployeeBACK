"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Zumira Integrations API",
            version: "1.0.0",
            description: "Documentacao detalhada dos endpoints de integrations",
        },
        servers: [
            {
                url: `http://localhost:${(_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3000"}`,
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
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
