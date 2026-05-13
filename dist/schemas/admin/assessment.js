"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAssessmentResultUserFiltersSchema = exports.SearchAssessmentResultsQuerySchema = exports.ASSESSMENT_RESULT_FILTER_COLUMNS = exports.AssessmentByCompanySchema = exports.UpdateRatingsSchema = exports.UpdateAssessmentSchema = exports.CreateAssessmentSchema = void 0;
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
exports.ASSESSMENT_RESULT_FILTER_COLUMNS = [
    "gender",
    "occupation",
    "occupationLevel",
    "area",
    "location",
    "skinColor",
    "hasDisability",
    "nationalityId",
];
const assessmentResultFilters = {
    gender: zod_1.z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    area: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    occupationLevel: zod_1.z.string().optional(),
    skinColor: zod_1.z.string().optional(),
    hasDisability: zod_1.z
        .string()
        .optional()
        .transform((v) => (v === undefined ? undefined : v === "true")),
    nationalityId: zod_1.z.string().cuid().optional(),
};
exports.SearchAssessmentResultsQuerySchema = zod_1.z.object({
    companyId: zod_1.z.string().cuid().optional(),
    search: zod_1.z.string().optional(),
    ...assessmentResultFilters,
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
exports.GetAssessmentResultUserFiltersSchema = zod_1.z.object({
    companyId: zod_1.z.string().cuid().optional(),
    columns: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .transform((v) => (Array.isArray(v) ? v : [v]))
        .pipe(zod_1.z.array(zod_1.z.enum(exports.ASSESSMENT_RESULT_FILTER_COLUMNS)).min(1)),
});
