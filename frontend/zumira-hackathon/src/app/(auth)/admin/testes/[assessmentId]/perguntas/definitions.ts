import { z } from "zod";

import { AssessmentQuestionSchema } from "@/schemas";

export const ManageQuestionChoiceSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string(),
  label: z.string().min(1),
  value: z.number(),
  index: z.number().int(),
});

export const ManageQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string(),
  description: z.string().min(1),
  index: z.number().int(),
  psychologicalDimensionId: z.string().uuid(),
  assessmentQuestionChoices: z.array(ManageQuestionChoiceSchema),
});

export type AssessmentQuestion = z.infer<typeof AssessmentQuestionSchema>;
export type ManageQuestion = z.infer<typeof ManageQuestionSchema>;
export type ManageQuestionChoice = z.infer<typeof ManageQuestionChoiceSchema>;
