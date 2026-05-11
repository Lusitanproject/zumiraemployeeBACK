"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const kleur_1 = __importDefault(require("kleur"));
function requestLogger(req, res, next) {
    const startedAt = process.hrtime.bigint();
    console.log(`${kleur_1.default.cyan(req.method)} ${kleur_1.default.blue(req.originalUrl)} - incoming`);
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        res.locals.responseBody = body;
        return originalJson(body);
    };
    res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1000000;
        const statusCode = res.statusCode;
        const statusColor = statusCode >= 500 ? kleur_1.default.red : statusCode >= 400 ? kleur_1.default.yellow : kleur_1.default.green;
        const errorMessage = res.locals.errorMessage;
        const errorLog = errorMessage ? ` ${kleur_1.default.red(`error="${errorMessage}"`)}` : "";
        const body = res.locals.responseBody;
        const bodyLog = body !== undefined ? `\n  ${kleur_1.default.yellow("body:")} ${JSON.stringify(body, null, 2)}` : "";
        console.log(`${kleur_1.default.cyan(req.method)} ${kleur_1.default.blue(req.originalUrl)} - ${statusColor(String(statusCode))} ${kleur_1.default.gray(`${durationMs.toFixed(1)}ms`)}${errorLog}${bodyLog}`);
    });
    next();
}
