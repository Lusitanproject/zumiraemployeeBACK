import { TriangleAlert } from "lucide-react";

import { getAssessmentData } from "../actions";
// import { getMonitoringBlocks } from "../../testes/actions"
import { getAssessmentQuestions, getDimensionsByBlock } from "./actions";
import { ManageQuestionsForm } from "./form";

export default async function ManageAssessmentQuestions({ params }: { params: Promise<{ assessmentId: string }> }) {
  const assessmentId = (await params).assessmentId;
  const data = await getAssessmentData(assessmentId);
  const questions = await getAssessmentQuestions(assessmentId);

  const dimensions = await getDimensionsByBlock(data?.selfMonitoringBlockId ?? "");

  if (questions.status === "ERROR" || !data) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between py-4 border-b border-border-100">
          <h3 className="font-bold text-2xl text-text-700">Editar Perguntas</h3>
        </div>
        <div className="flex items-center gap-x-4 py-6">
          <TriangleAlert className="size-6 text-error-500" />
          <span className="text-base text-error-500">
            Ocorreu um erro ao buscar as informações desse teste. Por favor, tente mais tarde.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <ManageQuestionsForm data={data} dimensions={dimensions} questions={questions.data.questions} />
    </div>
  );
}
