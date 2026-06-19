import { z } from "zod";

export const ActAnalysisCompanyQuerySchema = z.object({
  companyId: z.string().cuid(),
});

const analysisFilters = {
  search: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  area: z.string().optional(),
  similarExposureGroup: z.string().optional(),
  location: z.string().optional(),
  occupation: z.string().optional(),
  occupationLevel: z.string().optional(),
  skinColor: z.string().optional(),
  hasDisability: z
    .string()
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  nationalityId: z.string().cuid().optional(),
};

export const FindActAnalysisQuerySchema = z.object({
  companyId: z.string().cuid(),
  ...analysisFilters,
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const FindActAnalysisSummaryQuerySchema = z.object({
  companyId: z.string().cuid(),
  ...analysisFilters,
});

const ANALYSIS_FILTER_COLUMNS = [
  "gender",
  "occupation",
  "occupationLevel",
  "area",
  "similarExposureGroup",
  "location",
  "skinColor",
  "hasDisability",
  "nationalityId",
] as const;

export const GetAnalysisUserFiltersSchema = z.object({
  companyId: z.string().cuid(),
  columns: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .pipe(z.array(z.enum(ANALYSIS_FILTER_COLUMNS)).min(1)),
});

export const OverrideFactorAssociationsSchema = z.object({
  overrides: z
    .array(
      z.object({
        associationId: z.string().cuid(),
        newFactorId: z.string().cuid().nullable(),
      }),
    )
    .min(1),
});

export const UpdateAnalysisReportSchema = z.object({
  companyName: z.string().optional(),
  evaluationPeriod: z.string().nullable().optional(),
  evaluationType: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  totalParticipants: z.number().int().min(0).optional(),
  technicalResponsible: z.string().nullable().optional(),
  professionalRegistration: z.string().nullable().optional(),
  issuedAt: z.coerce.date().nullable().optional(),
});

export type ActAnalysisCompanyQuery = z.infer<typeof ActAnalysisCompanyQuerySchema>;
export type FindActAnalysisQuery = z.infer<typeof FindActAnalysisQuerySchema>;
export type FindActAnalysisSummaryQuery = z.infer<typeof FindActAnalysisSummaryQuerySchema>;
export type GetAnalysisUserFiltersQuery = z.infer<typeof GetAnalysisUserFiltersSchema>;
export type OverrideFactorAssociationsRequest = z.infer<typeof OverrideFactorAssociationsSchema>;
export type UpdateAnalysisReportRequest = z.infer<typeof UpdateAnalysisReportSchema>;
