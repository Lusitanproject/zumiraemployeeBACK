import { z } from "zod";

export const ActAnalysisCompanyQuerySchema = z.object({
  companyId: z.string().cuid(),
});

const analysisFilters = {
  search: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  area: z.string().optional(),
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

export type ActAnalysisCompanyQuery = z.infer<typeof ActAnalysisCompanyQuerySchema>;
export type FindActAnalysisQuery = z.infer<typeof FindActAnalysisQuerySchema>;
export type FindActAnalysisSummaryQuery = z.infer<typeof FindActAnalysisSummaryQuerySchema>;
