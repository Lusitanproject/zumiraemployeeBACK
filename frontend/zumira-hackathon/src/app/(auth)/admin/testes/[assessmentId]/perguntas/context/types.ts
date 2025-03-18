import { ManageQuestion } from "../definitions"

export type ManageQuestionState = {
  questions: ManageQuestion[]
}

type SetDescription = {
  key: string
  value: string
}

type SetDimension = {
  key: string
  value: string
}

type SetChoiceLabel = {
  questionKey: string
  choiceKey: string
  value: string
}

type SetChoiceValue = {
  questionKey: string
  choiceKey: string
  value: number
}

export type ManageQuestionAction =
  | { type: "MOVE-QUESTION-UP", payload: string }
  | { type: "MOVE-QUESTION-DOWN", payload: string }
  | { type: "ADD-QUESTION" }
  | { type: "REMOVE-QUESTION", payload: string }
  | { type: "SET-DESCRIPTION", payload: SetDescription }
  | { type: "SET-DIMENSION", payload: SetDimension }
  | { type: "DUPLICATE", payload: string }
  | { type: "SET-CHOICE-LABEL", payload: SetChoiceLabel }
  | { type: "SET-CHOICE-VALUE", payload: SetChoiceValue }
