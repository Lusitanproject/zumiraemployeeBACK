import { AssessmentQuestionChoices } from "../definitions";

export function getFormAnswersData(formData: FormData) {
  const data = [];

  for (const answer of formData.entries()) {
    data.push({ key: answer[0], value: answer[1] as string });
  }

  const answers: AssessmentQuestionChoices = data
    .filter((item) => item.key !== "assessmentId" && item.key.indexOf("$ACTION_") === -1)
    .map((item) => ({
      assessmentQuestionId: item.key,
      assessmentQuestionChoiceId: item.value,
    }));

  const assessmentId = data.find((item) => item.key === "assessmentId")?.value;

  return {
    assessmentId,
    answers,
  };
}
