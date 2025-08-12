import { getAssessmentData } from "./actions/assessment-data";
import { AssessmentForm } from "./form";

export default async function Questionario({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const assessment = await getAssessmentData(assessmentId);

  if (assessment.status === "ERROR") {
    return <></>;
  }

  if (assessment.status === "COMPLETED") {
    return <></>;
  }

  return <AssessmentForm assessmentId={assessmentId} data={assessment.data} />;
}
