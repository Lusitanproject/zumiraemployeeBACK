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
    <div className="w-full pb-8 [&:not(:last-child)]:border-b border-border-200 mb-8">
      <h3 className="text-base font-semibold text-text-700 mb-5">{title}</h3>
      <div className="flex w-full flex-none gap-3 overflow-auto">
        {data.map((item) => (
          <AssessmentCard
            key={item.id}
            completed={!!completed}
            id={item.id}
            summary={item.summary}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
}
