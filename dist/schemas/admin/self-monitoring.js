"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSelfMonitoringSchema = exports.EditSelfMonitoringBlockSchema = exports.CreateSelfMonitoringBlockSchema = void 0;
const zod_1 = require("zod");
exports.CreateSelfMonitoringBlockSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    summary: zod_1.z.string(),
    icon: zod_1.z.string(),
});
exports.EditSelfMonitoringBlockSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    summary: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
exports.FindSelfMonitoringSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
