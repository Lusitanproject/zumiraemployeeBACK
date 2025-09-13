"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCompanySchema = exports.CreateCompanySchema = void 0;
const zod_1 = require("zod");
exports.CreateCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    trailId: zod_1.z.string().cuid(),
});
exports.FindCompanySchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
