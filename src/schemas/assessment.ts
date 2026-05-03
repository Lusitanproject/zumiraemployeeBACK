import { z } from "zod";

export const ListAssessmentsSchema = z.object({
  nationalityId: z.string().cuid().optional(),
});

export type ListAssessmentsRequest = { userId: string } & z.infer<typeof ListAssessmentsSchema>;
export type DetailResultRequest = { userId: string; assessmentId: string };
