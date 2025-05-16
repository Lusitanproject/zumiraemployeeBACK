import { Operation } from "@prisma/client";
import { z } from "zod";

export const CreateAssessmentSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().optional(),
  selfMonitoringBlockId: z.string().cuid(),
  userFeedbackInstructions: z.string().optional(),
  companyFeedbackInstructions: z.string().optional(),
  operationType: z.nativeEnum(Operation),
  nationalityId: z.string().cuid(),
});

export const UpdateAssessmentSchema = z.object({
  id: z.string().cuid(),
  summary: z.string().min(1).optional(),
  description: z.string().optional(),
  selfMonitoringBlockId: z.string().cuid().optional(),
  userFeedbackInstructions: z.string().optional(),
  companyFeedbackInstructions: z.string().optional(),
  operationType: z.nativeEnum(Operation),
  nationalityId: z.string().cuid(),
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

export type CreateAssessment = z.infer<typeof CreateAssessmentSchema>;
export type UpdateAssessment = z.infer<typeof UpdateAssessmentSchema>;
export type UpdateRatingsRequest = z.infer<typeof UpdateRatingsSchema> & { assessmentId: string };
