"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssessmentSchema = exports.CreateAssessmentSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.CreateAssessmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    summary: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    selfMonitoringBlockId: zod_1.z.string().cuid(),
    openaiAssistantId: zod_1.z.string().optional(),
    operationType: zod_1.z.nativeEnum(client_1.Operation),
    nationalityId: zod_1.z.string().cuid(),
});
exports.UpdateAssessmentSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    summary: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    selfMonitoringBlockId: zod_1.z.string().cuid().optional(),
    openaiAssistantId: zod_1.z.string().optional(),
    operationType: zod_1.z.nativeEnum(client_1.Operation),
    nationalityId: zod_1.z.string().cuid(),
});
