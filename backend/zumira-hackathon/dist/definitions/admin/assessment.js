"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentByCompanySchema = exports.UpdateRatingsSchema = exports.UpdateAssessmentSchema = exports.CreateAssessmentSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.CreateAssessmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    summary: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    selfMonitoringBlockId: zod_1.z.string().cuid(),
    userFeedbackInstructions: zod_1.z.string().optional(),
    companyFeedbackInstructions: zod_1.z.string().optional(),
    operationType: zod_1.z.nativeEnum(client_1.AssessmentOperation),
    nationalityId: zod_1.z.string().cuid(),
    public: zod_1.z.boolean(),
});
exports.UpdateAssessmentSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    title: zod_1.z.string().nonempty(),
    summary: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    selfMonitoringBlockId: zod_1.z.string().cuid().optional(),
    userFeedbackInstructions: zod_1.z.string().optional(),
    companyFeedbackInstructions: zod_1.z.string().optional(),
    operationType: zod_1.z.nativeEnum(client_1.AssessmentOperation),
    nationalityId: zod_1.z.string().cuid(),
    public: zod_1.z.boolean(),
});
exports.UpdateRatingsSchema = zod_1.z.object({
    ratings: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid().optional(),
        risk: zod_1.z.string().nonempty(),
        profile: zod_1.z.string().nonempty(),
        color: zod_1.z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            message: "Color value must be in hexadecimal (#RRGGBB)",
        }),
    })),
});
exports.AssessmentByCompanySchema = zod_1.z.object({
    assessmentId: zod_1.z.string().cuid(),
    companyId: zod_1.z.string().cuid().optional(),
});
