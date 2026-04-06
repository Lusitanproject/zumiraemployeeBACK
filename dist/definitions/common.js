"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdSchema = exports.PhoneNumberSchema = exports.RequestParamsIdCUID = exports.RequestParamsIdUUID = void 0;
const zod_1 = require("zod");
exports.RequestParamsIdUUID = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.RequestParamsIdCUID = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
exports.PhoneNumberSchema = zod_1.z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => /^\d{2}9\d{8}$/.test(val), "Invalid phone number. Must be a Brazilian mobile number with 11 digits (area code + 9 + 8 digits). Example: 11987654321");
exports.UserIdSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
});
