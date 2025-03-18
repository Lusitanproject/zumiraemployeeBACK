import { z } from "zod";
import { AssessmentSchema, SelfMonitoringBlockSchema } from "@/schemas";

export type Assessment = z.infer<typeof AssessmentSchema>

export type AssessmentSummary = {
  id: string,
  title: string,
  description: string,
  summary: string,
  selfMonitoringBlockId: string
}

export type AssessmentResponse = 
  | { status: "SUCCESS", data: AssessmentSummary }
  | { status: "ERROR", message: string }

export const CreateAssessmentSchema = z.object({
  title: z.string().min(1, "O campo título é obrigatório"),
  summary: z.string().min(1),
  description: z.string(),
  selfMonitoringBlockId: z.string().cuid(),
})

export type ManageAssessment = z.infer<typeof CreateAssessmentSchema>
export type MonitoringBlock = z.infer<typeof SelfMonitoringBlockSchema>

export type FormErrors =
  | {
    title?: string[]
    summary?: string[]
    description?: string[]
    selfMonitoringBlockId?: string[]
  }
  | null

export const INITIAL_VALUE: ManageAssessment = {
  title: "",
  summary: "",
  description: "",
  selfMonitoringBlockId: ""
}

export type CreateAssessmentResponse =
  | {
    status: "SUCCESS",
    data: {
      id: string
      title: string
      summary: string | null
      description: string | null
      selfMonitoringBlockId: string
    }
  }
  | { status: "ERROR", message: string }
