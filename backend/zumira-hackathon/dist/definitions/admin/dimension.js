"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditDimensionSchema = exports.CreateDimensionSchema = void 0;
const zod_1 = require("zod");
exports.CreateDimensionSchema = zod_1.z.object({
    acronym: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    selfMonitoringBlockId: zod_1.z.string().cuid(),
});
exports.EditDimensionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    acronym: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    selfMonitoringBlockId: zod_1.z.string().cuid(),
});
