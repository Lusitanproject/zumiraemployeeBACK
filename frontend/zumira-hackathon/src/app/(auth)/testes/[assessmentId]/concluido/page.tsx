import { Concluded } from "./components/concluded";

export default async function AssessmentComplete({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;

  return <Concluded assessmentId={assessmentId} />;
}
