"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserSchema = exports.CreateUserSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const common_1 = require("./common");
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).optional(),
    phoneNumber: common_1.PhoneNumberSchema.optional(),
    customId: zod_1.z.string().nonempty().optional(),
    birthdate: common_1.DateStringSchema.optional(),
    admissionDate: common_1.DateStringSchema.optional(),
    nationalityId: zod_1.z.string().cuid().optional(),
    gender: zod_1.z.nativeEnum(client_1.UserGender).optional(),
    occupation: zod_1.z.string().nonempty().optional(),
    occupationLevel: zod_1.z.string().nonempty().optional(),
    area: zod_1.z.string().nonempty().optional(),
    location: zod_1.z.string().nonempty().optional(),
    skinColor: zod_1.z.string().nonempty().optional(),
    hasDisability: zod_1.z.boolean().optional(),
});
exports.AuthUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string().length(6).optional(),
    password: zod_1.z.string().optional(),
});
