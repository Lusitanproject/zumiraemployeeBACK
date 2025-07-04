import { z } from "zod";

export const FindCompanyFeedbackSchema = z.object({
  assessmentId: z.string().cuid(),
});

export type FindCompanyFeedbackRequest = z.infer<typeof FindCompanyFeedbackSchema> & { companyId: string };
