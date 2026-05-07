"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseZodError = parseZodError;
function parseZodError(error) {
    // Retorna no formato "[campo_1]: mensagem de erro; [campo_2.campo_2_1]: mensagem de erro ..."
    return error.errors.map((e) => `[${e.path.join(".")}]: ${e.message}`).join("; ");
}
