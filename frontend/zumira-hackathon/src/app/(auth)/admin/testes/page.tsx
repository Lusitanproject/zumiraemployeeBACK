import { getAssessments } from "./actions";
import { AssessmentList } from "./components/assessment-list";
import { Header } from "./components/header";

export default async function Testes() {
  const assessments = await getAssessments();

  return (
    <div className="flex flex-col">
      <div className="w-full pb-8 [&:not(:last-child)]:border-b border-gray-200 mb-8">
        <Header />
        <AssessmentList data={assessments} />
      </div>
    </div>
  );
}
