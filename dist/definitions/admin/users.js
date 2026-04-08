"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserBySchema = exports.CreateCompanySchema = exports.UpdateUserSchema = exports.FindByEmailSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("../common");
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    roleId: zod_1.z.string().uuid(),
    companyId: zod_1.z.string().cuid().optional(),
    phoneNumber: common_1.PhoneNumberSchema.optional(),
});
exports.FindByEmailSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    roleId: zod_1.z.string().uuid().optional(),
    companyId: zod_1.z.string().cuid().optional(),
    phoneNumber: common_1.PhoneNumberSchema.optional(),
});
exports.CreateCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
});
exports.FindUserBySchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid().optional(),
    email: zod_1.z.string().email().optional(),
    phoneNumber: common_1.PhoneNumberSchema.optional(),
})
    .refine((data) => Object.values(data).filter(Boolean).length > 0, // Verifica se ha ao menos um valor presente no objeto
"At least one of the fields (id, email or phoneNumber) must be provided");
