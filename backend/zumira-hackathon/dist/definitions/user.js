"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserSchema = exports.CreateUserSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).optional(),
    birthdate: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)))
        .transform((val) => new Date(val))
        .optional(),
    nationalityId: zod_1.z.string().cuid().optional(),
    gender: zod_1.z.nativeEnum(client_1.UserGender).optional(),
    occupation: zod_1.z.string().nonempty().optional(),
});
exports.AuthUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string().length(6).optional(),
    password: zod_1.z.string().optional(),
});
