import { z } from "zod";

import { MessageWithHistorySchema } from "./common";

export const ListAssessmentsSchema = z.object({
  nationalityId: z.string().cuid().optional(),
});

export type ListAssessmentsRequest = { userId: string } & z.infer<typeof ListAssessmentsSchema>;
export type DetailResultRequest = { userId: string; assessmentId: string };

/**
 * POST /companies/admin/:companyId/feedback/users
 */
export const GenerateAllUserFeedbackParamsSchema = z.object({
  companyId: z.string().cuid(),
});

export type GenerateAllUserFeedbackResponse = {
  status: "SUCCESS";
  data: {
    companyId: string;
    queuedCount: number;
    message: string;
  };
};

export const AssessmentAnalysisMessageSchema = MessageWithHistorySchema;

export type AssessmentAnalysisMessageRequest = z.infer<typeof AssessmentAnalysisMessageSchema>;
