"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const errorHandler_1 = require("./middlewares/errorHandler");
const requestLogger_1 = require("./middlewares/requestLogger");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const swaggerServeHandlers = swagger_ui_express_1.default.serve;
const swaggerSetupHandler = swagger_ui_express_1.default.setup(swagger_1.swaggerSpec);
const requestBodyLimit = (_a = process.env.REQUEST_BODY_LIMIT) !== null && _a !== void 0 ? _a : "100mb";
app.use(express_1.default.json({ limit: requestBodyLimit }));
app.use(express_1.default.urlencoded({ extended: true, limit: requestBodyLimit }));
app.use((0, cors_1.default)());
app.use(requestLogger_1.requestLogger);
app.use("/docs", ...swaggerServeHandlers, swaggerSetupHandler);
app.get("/docs-json", (_req, res) => res.json(swagger_1.swaggerSpec));
app.use(routes_1.router);
app.use(errorHandler_1.errorHandler);
app.listen(process.env.PORT, () => {
    console.log(`\nServer hosted in localhost:${process.env.PORT}\n`);
});
