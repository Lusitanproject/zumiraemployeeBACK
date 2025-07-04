import { TriangleAlert } from "lucide-react";

import { getAssessmentData } from "../actions";
import { getAssessmentRatings } from "./actions";
import { ManageRatingsForm } from "./form";

export default async function ManageAssessmentQuestions({ params }: { params: Promise<{ assessmentId: string }> }) {
  const assessmentId = (await params).assessmentId;
  const data = await getAssessmentData(assessmentId);
  const ratings = await getAssessmentRatings(assessmentId);

  if (!data) {
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
      <ManageRatingsForm data={data} ratings={ratings} />
    </div>
  );
}
