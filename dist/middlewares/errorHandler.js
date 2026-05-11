"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const kleur_1 = __importDefault(require("kleur"));
const error_1 = require("../error");
function errorHandler(err, req, res, _next) {
    console.error(`${kleur_1.default.red(req.method)} ${kleur_1.default.red(req.url)}: ${err.stack}`);
    if (err.type === "entity.too.large" || err.name === "PayloadTooLargeError") {
        return res.status(413).json({
            status: "ERROR",
            message: "Payload muito grande",
        });
    }
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
}
