import { z } from "zod";

export const FindCompanyFeedbackSchema = z.object({
  assessmentId: z.string().cuid(),
});

export const SetCompanyAssessmentsSchema = z.object({
  assessmentIds: z.string().array(),
});

export type FindCompanyFeedbackRequest = z.infer<typeof FindCompanyFeedbackSchema> & { companyId: string };
export type SetCompanyAssessmentsRequest = z.infer<typeof SetCompanyAssessmentsSchema> & { id: string };
