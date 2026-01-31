"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationTypeSchema = exports.CreateNotificationTypeSchema = void 0;
const zod_1 = require("zod");
exports.CreateNotificationTypeSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty(),
    color: zod_1.z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
        message: "Color must be in hexadecimal",
    }),
    priority: zod_1.z.number().int(),
});
exports.UpdateNotificationTypeSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().nonempty(),
    color: zod_1.z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
        message: "Color must be in hexadecimal",
    }),
    priority: zod_1.z.number().int(),
});
