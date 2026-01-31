"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devLog = devLog;
function devLog(...args) {
    if (process.env.PRODUCTION !== "true") {
        console.log(...args);
    }
}
