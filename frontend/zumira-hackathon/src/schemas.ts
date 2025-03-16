import { z } from "zod";

export const SelfMonitoringBlockSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  summary: z.string().optional(),
  icon: z.string().optional()
})

export const AssessmentSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  assessmentQuestions: z.array(z.object({
    id: z.string().uuid(),
    description: z.string(),
    index: z.number().int(),
    assessmentQuestionChoices: z.array(z.object({
      id: z.string().uuid(),
      label: z.string(),
      value: z.number(),
      index: z.number().int()
    }))
  }))
})
