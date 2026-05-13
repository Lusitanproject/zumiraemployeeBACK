"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverrideFactorAssociationsSchema = exports.GetAnalysisUserFiltersSchema = exports.FindActAnalysisSummaryQuerySchema = exports.FindActAnalysisQuerySchema = exports.ActAnalysisCompanyQuerySchema = void 0;
const zod_1 = require("zod");
exports.ActAnalysisCompanyQuerySchema = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
});
const analysisFilters = {
    search: zod_1.z.string().optional(),
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
exports.FindActAnalysisQuerySchema = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
    ...analysisFilters,
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
});
exports.FindActAnalysisSummaryQuerySchema = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
    ...analysisFilters,
});
const ANALYSIS_FILTER_COLUMNS = [
    "gender",
    "occupation",
    "occupationLevel",
    "area",
    "location",
    "skinColor",
    "hasDisability",
    "nationalityId",
];
exports.GetAnalysisUserFiltersSchema = zod_1.z.object({
    companyId: zod_1.z.string().cuid(),
    columns: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .transform((v) => (Array.isArray(v) ? v : [v]))
        .pipe(zod_1.z.array(zod_1.z.enum(ANALYSIS_FILTER_COLUMNS)).min(1)),
});
exports.OverrideFactorAssociationsSchema = zod_1.z.object({
    overrides: zod_1.z
        .array(zod_1.z.object({
        associationId: zod_1.z.string().cuid(),
        newFactorId: zod_1.z.string().cuid().nullable(),
    }))
        .min(1),
});
