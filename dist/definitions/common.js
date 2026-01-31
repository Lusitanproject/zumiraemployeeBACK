"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestParamsIdCUID = exports.RequestParamsIdUUID = void 0;
const zod_1 = require("zod");
exports.RequestParamsIdUUID = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.RequestParamsIdCUID = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
