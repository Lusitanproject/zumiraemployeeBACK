import { Assessment } from "../definitions";
import { AssessmentCard } from "./assessment-card";

type AssessmentListProps = {
  title: string;
  data: Assessment[];
  completed?: boolean;
};

export function AssessmentList({ data, title, completed }: AssessmentListProps) {
  if (!data.length) {
    return <></>;
  }

  return (
    <div className="w-full pb-8 [&:not(:last-child)]:border-b border-gray-200 mb-8">
      <h3 className="text-base font-semibold text-gray-700 mb-5">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {data.map((item) => (
          <AssessmentCard
            key={item.id}
            id={item.id}
            summary={item.summary}
            title={item.title}
            completed={!!completed}
          />
        ))}
      </div>
    </div>
  );
}
