import { getMonitoringBlocks, getNationalities } from "../../autoconhecimento/actions";
import { Header } from "./components/header";
import { getAssessmentData } from "./actions";
import { AssessmentForm } from "./form";

export default async function ManageAssessment({ params }: { params: Promise<{ assessmentId: string }> }) {
  const assessmentId = (await params).assessmentId;
  const data = await getAssessmentData(assessmentId === "novo" ? null : assessmentId);
  const { data: blocks } = await getMonitoringBlocks();
  const { data: nationalities } = await getNationalities();

  return (
    <div className="flex flex-col w-full">
      <Header title="Editar detalhes do teste" />
      <AssessmentForm data={data} blocks={blocks} nationalities={nationalities} />
    </div>
  );
}
