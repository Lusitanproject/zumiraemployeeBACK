import { getAssessments, getSelfMonitoringBlocks } from "./actions";
import { Assessments } from "./components/assessments";

export default async function Testes() {
  const assessments = await getAssessments();
  const blocks = await getSelfMonitoringBlocks();

  return (
    <div className="flex flex-col w-full">
      <Assessments assessments={assessments} blocks={blocks} />
    </div>
  );
}
