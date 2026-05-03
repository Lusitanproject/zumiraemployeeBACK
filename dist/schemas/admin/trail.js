"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrailSchema = exports.CreateTrailSchema = void 0;
const zod_1 = require("zod");
exports.CreateTrailSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty(),
    subtitle: zod_1.z.string().nonempty(),
    description: zod_1.z.string().nonempty(),
});
exports.UpdateTrailSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty().optional(),
    subtitle: zod_1.z.string().nonempty().optional(),
    description: zod_1.z.string().nonempty().optional(),
});
