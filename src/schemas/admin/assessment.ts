import { AssessmentOperation } from "@prisma/client";
import { z } from "zod";

export const CreateAssessmentSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().optional(),
  selfMonitoringBlockId: z.string().cuid(),
  userFeedbackInstructions: z.string().optional(),
  companyFeedbackInstructions: z.string().optional(),
  consultiveAiInstructions: z.string().optional(),
  operationType: z.nativeEnum(AssessmentOperation),
  nationalityId: z.string().cuid(),
  public: z.boolean(),
});

export const UpdateAssessmentSchema = z.object({
  id: z.string().cuid(),
  title: z.string().nonempty(),
  summary: z.string().min(1).optional(),
  description: z.string().optional(),
  selfMonitoringBlockId: z.string().cuid().optional(),
  userFeedbackInstructions: z.string().optional(),
  companyFeedbackInstructions: z.string().optional(),
  consultiveAiInstructions: z.string().optional(),
  operationType: z.nativeEnum(AssessmentOperation),
  nationalityId: z.string().cuid(),
  public: z.boolean(),
});

export const UpdateRatingsSchema = z.object({
  ratings: z.array(
    z.object({
      id: z.string().uuid().optional(),
      risk: z.string().nonempty(),
      profile: z.string().nonempty(),
      color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: "Color value must be in hexadecimal (#RRGGBB)",
      }),
    })
  ),
});

export const AssessmentByCompanySchema = z.object({
  assessmentId: z.string().cuid(),
  companyId: z.string().cuid().optional(),
});

export type CreateAssessment = z.infer<typeof CreateAssessmentSchema>;
export type UpdateAssessment = z.infer<typeof UpdateAssessmentSchema>;
export type UpdateRatingsRequest = z.infer<typeof UpdateRatingsSchema> & { assessmentId: string };
export type AssessmentByCompanyRequest = z.infer<typeof AssessmentByCompanySchema>;

export const ASSESSMENT_RESULT_FILTER_COLUMNS = [
  "gender",
  "occupation",
  "occupationLevel",
  "area",
  "location",
  "skinColor",
  "hasDisability",
  "nationalityId",
] as const;

export type AssessmentResultFilterColumn = (typeof ASSESSMENT_RESULT_FILTER_COLUMNS)[number];

const assessmentResultFilters = {
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

export const SearchAssessmentResultsQuerySchema = z.object({
  companyId: z.string().cuid().optional(),
  search: z.string().optional(),
  ...assessmentResultFilters,
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const GetAssessmentResultUserFiltersSchema = z.object({
  companyId: z.string().cuid().optional(),
  columns: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .pipe(z.array(z.enum(ASSESSMENT_RESULT_FILTER_COLUMNS)).min(1)),
});

export type SearchAssessmentResultsQuery = z.infer<typeof SearchAssessmentResultsQuerySchema>;
export type GetAssessmentResultUserFiltersQuery = z.infer<typeof GetAssessmentResultUserFiltersSchema>;
