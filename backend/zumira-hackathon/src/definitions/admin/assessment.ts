import { z } from "zod"

export const CreateAssessmentSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().optional(),
  selfMonitoringBlockId: z.string().cuid()
})

export const UpdateAssessmentSchema = z.object({
  id: z.string().cuid(),
  summary: z.string().min(1).optional(),
  description: z.string().optional(),
  selfMonitoringBlockId: z.string().cuid().optional()
})

export type CreateAssessment = z.infer<typeof CreateAssessmentSchema>
export type UpdateAssessment = z.infer<typeof UpdateAssessmentSchema>