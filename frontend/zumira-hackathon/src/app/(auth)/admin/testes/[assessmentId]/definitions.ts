import { z } from "zod";
import { AssessmentSchema } from "@/schemas";

export type Assessment = z.infer<typeof AssessmentSchema>

export type AssessmentResponse = {
  status: "SUCCESS",
  data: Assessment
}

export const CreateAssessmentSchema = z.object({
  title: z.string().min(1, "O campo título é obrigatório"),
  summary: z.string(),
  description: z.string(),
  assessmentQuestions: z.array(z.object({
    id: z.string().uuid().nullable()
  }))
})

export type ManageAssessment = z.infer<typeof CreateAssessmentSchema>

export type FormErrors =
| {
  title?: string[]
  summary?: string[]
  description?: string[]
}
| null

export const INITIAL_VALUE = {
  title: "",
  summary: "",
  description: "",
  assessmentQuestions: []
}
