import { AssessmentQuestion, ManageQuestion } from "./definitions";

export function translateQuestions(data: AssessmentQuestion[]): ManageQuestion[] {
  const parsed: ManageQuestion[] = data.map(item => {
    return ({
      id: item.id,
      key: item.id,
      index: item.index,
      description: item.description,
      psychologicalDimensionId: item.psychologicalDimension.id,
      assessmentQuestionChoices: item.assessmentQuestionChoices.map(question => ({
        id: question.id,
        key: question.id,
        index: question.index,
        label: question.label,
        value: question.value
      }))
    })
  })
  return parsed
}
