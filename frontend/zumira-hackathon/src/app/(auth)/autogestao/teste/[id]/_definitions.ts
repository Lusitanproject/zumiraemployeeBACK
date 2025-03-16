import { z } from "zod"

export type GetAssessmentQuestions = {
  status: "SUCCESS",
  data: AssessmentDetail
}

export type AssessmentDetail = {
  id: string
  title: string
  description: string | null
  questions: AssessmentQuestion[]
}

export type AssessmentQuestion = {
  id: string
  description: string
  choices: Array<{
    id: string
    label: string
    value: number
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
