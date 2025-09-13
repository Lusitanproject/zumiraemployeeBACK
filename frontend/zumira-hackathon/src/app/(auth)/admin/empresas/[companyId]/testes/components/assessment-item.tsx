import { Checkbox } from "@/components/ui/checkbox";
import { Assessment } from "@/types/assessment";

interface AssessmentItemProps {
  assessment: Assessment;
  isSelected: boolean;
  onToggle: (assessment: Assessment, checked: boolean) => void;
}

export function AssessmentItem({ assessment, isSelected, onToggle }: AssessmentItemProps) {
  return (
    <div className="rounded-xl bg-background-100 p-4 text-text-600 flex flex-row justify-between">
      <span>{assessment.title}</span>
      <Checkbox checked={isSelected} onChange={(e) => onToggle(assessment, e.target.checked)} />
    </div>
  );
}
