import { Assessment } from "@/types/assessment";

import { AssessmentItem } from "./assessment-item";

interface AssessmentListProps {
  assessments: Assessment[];
  search: string;
  title: string;
  selected?: boolean;
  onToggleAssessment: (assessment: Assessment, checked: boolean) => void;
}

export function AssessmentList({ title, assessments, search, onToggleAssessment, selected }: AssessmentListProps) {
  const shownItems = assessments.filter((a) => !search.length || a.title.toLowerCase().includes(search));

  return (
    <div className="flex flex-col gap-2 size-full">
      <h3 className="font-medium text-text-500 text-lg">{title}</h3>
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 w-full pb-14 pt-2">
        {shownItems.length > 0 ? (
          shownItems.map((assessment) => (
            <AssessmentItem
              key={assessment.id}
              assessment={assessment}
              isSelected={!!selected}
              onToggle={onToggleAssessment}
            />
          ))
        ) : (
          <span className="flex text-text-400 h-full w-full text-center items-center justify-center">
            Nenhum item encontrado
          </span>
        )}
      </div>
    </div>
  );
}
