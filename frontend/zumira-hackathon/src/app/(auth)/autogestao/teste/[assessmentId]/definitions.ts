import { z } from "zod"

export type GetAssessmentData = {
  status: "SUCCESS",
  data: AssessmentDetail
}

export type AssessmentDetail = {
  id: string
  title: string
  description: string | null
  assessmensQuestions: AssessmentQuestion[]
  lastCompleted: Date | null
}

export type AssessmentQuestion = {
  id: string
  description: string
  index: number
  assessmentQuestionChoices: Array<{
    id: string
    label: string
    value: number
    index: number
  }>
}


export const AnswerAssessment = z.object({

})

export type FormState =
  | {
    errors?: {
      email?: string[]
    }
  }
  | undefined
