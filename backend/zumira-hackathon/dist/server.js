"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const kleur_1 = __importDefault(require("kleur"));
const error_1 = require("./error");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.router);
app.use((err, req, res, _next) => {
    console.error(`${kleur_1.default.red(req.url)}: ${err.message}`);
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
