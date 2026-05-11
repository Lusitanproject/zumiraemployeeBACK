import { z } from "zod";

export const ActAnalysisCompanyQuerySchema = z.object({
  companyId: z.string().cuid(),
});

export const FindActAnalysisQuerySchema = z.object({
  companyId: z.string().cuid(),
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
});

export type ActAnalysisCompanyQuery = z.infer<typeof ActAnalysisCompanyQuerySchema>;
export type FindActAnalysisQuery = z.infer<typeof FindActAnalysisQuerySchema>;
