"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanySchema = exports.UpdateUserSchema = exports.FindByEmailSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    roleId: zod_1.z.string().uuid(),
    companyId: zod_1.z.string().cuid().optional(),
});
exports.FindByEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    roleId: zod_1.z.string().uuid().optional(),
    companyId: zod_1.z.string().cuid().optional(),
});
exports.CreateCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
});
