import { Assessment } from "../definitions";
import { AssessmentCard } from "./assessment-card";

type AssessmentListProps = {
  data: Assessment[];
};

export function AssessmentList({ data }: AssessmentListProps) {
  if (!data.length) {
    return <></>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-4">
      {data.map((item) => (
        <AssessmentCard key={item.id} id={item.id} summary={item.summary} title={item.title} />
      ))}
    </div>
  );
}
