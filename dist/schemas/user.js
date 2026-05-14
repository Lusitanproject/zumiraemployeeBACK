"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncCompanyParamsSchema = exports.SyncUsersPayloadSchema = exports.SyncUserItemSchema = exports.AuthUserSchema = exports.CreateUserSchema = void 0;
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
    similarExposureGroup: zod_1.z.string().nonempty().optional(),
    location: zod_1.z.string().nonempty().optional(),
    skinColor: zod_1.z.string().nonempty().optional(),
    hasDisability: zod_1.z.boolean().optional(),
});
exports.AuthUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    code: zod_1.z.string().length(6).optional(),
    password: zod_1.z.string().optional(),
});
exports.SyncUserItemSchema = zod_1.z.object({
    customId: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    phoneNumber: common_1.PhoneNumberSchema.optional(),
    occupation: zod_1.z.string().optional(),
    occupationLevel: zod_1.z.string().optional(),
    area: zod_1.z.string().optional(),
    similarExposureGroup: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    skinColor: zod_1.z.string().optional(),
    hasDisability: zod_1.z.boolean().optional(),
    birthdate: common_1.DateStringSchema.optional(),
    admissionDate: common_1.DateStringSchema.optional(),
    gender: zod_1.z.nativeEnum(client_1.UserGender).optional(),
    nationalityId: zod_1.z.string().cuid().optional(),
});
exports.SyncUsersPayloadSchema = zod_1.z.object({
    users: zod_1.z.array(exports.SyncUserItemSchema).min(1),
});
exports.SyncCompanyParamsSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
