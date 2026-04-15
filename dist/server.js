"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const kleur_1 = __importDefault(require("kleur"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const error_1 = require("./error");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const swaggerServeHandlers = swagger_ui_express_1.default.serve;
const swaggerSetupHandler = swagger_ui_express_1.default.setup(swagger_1.swaggerSpec);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    const startedAt = process.hrtime.bigint();
    console.log(`${kleur_1.default.cyan(req.method)} ${kleur_1.default.blue(req.originalUrl)} - incoming`);
    res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1000000;
        const statusCode = res.statusCode;
        const statusColor = statusCode >= 500 ? kleur_1.default.red : statusCode >= 400 ? kleur_1.default.yellow : kleur_1.default.green;
        const errorMessage = res.locals.errorMessage;
        const errorLog = errorMessage ? ` ${kleur_1.default.red(`error=\"${errorMessage}\"`)}` : "";
        console.log(`${kleur_1.default.cyan(req.method)} ${kleur_1.default.blue(req.originalUrl)} - ${statusColor(String(statusCode))} ${kleur_1.default.gray(`${durationMs.toFixed(1)}ms`)}${errorLog}`);
    });
    next();
});
app.use("/docs", ...swaggerServeHandlers, swaggerSetupHandler);
app.get("/docs-json", (_req, res) => res.json(swagger_1.swaggerSpec));
app.use(routes_1.router);
app.use((err, req, res, _next) => {
    console.error(`${kleur_1.default.red(req.method)} ${kleur_1.default.red(req.url)}: ${err.stack}`);
    if (err instanceof error_1.PublicError) {
        return res.status(400).json({
            status: "ERROR",
            message: err.message,
        });
    }
    return res.status(500).json({
        status: "ERROR",
        message: "Erro interno",
    });
});
app.listen(process.env.PORT, () => {
    console.log(`\nServer hosted in localhost:${process.env.PORT}\n`);
});
