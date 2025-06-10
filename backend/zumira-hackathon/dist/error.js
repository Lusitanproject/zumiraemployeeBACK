"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicError = void 0;
class PublicError extends Error {
    constructor(message) {
        var _a;
        super(message);
        this.name = "PublicError";
        (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, PublicError);
    }
}
exports.PublicError = PublicError;
