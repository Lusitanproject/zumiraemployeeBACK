import { subYears, isAfter } from "date-fns";
import { Assessment } from "./definitions";

type FilterProps = {
  selfMonitoringBlockId: string | null;
  term: string | null;
  data: Assessment[];
};

type ParsedAssessmentList = {
  completed: Assessment[];
  available: Assessment[];
};

export function useFilteredAssessments({ data, selfMonitoringBlockId, term }: FilterProps): ParsedAssessmentList {
  const filteredBySelfMonitoring = selfMonitoringBlockId
    ? data.filter((item) => item.selfMonitoring.id === selfMonitoringBlockId)
    : data;
  const filteredBySearchTerm = term
    ? filteredBySelfMonitoring.filter((item) => item.title.toLowerCase().indexOf(term.toLowerCase()) !== -1)
    : filteredBySelfMonitoring;

  const completed = filteredBySearchTerm.filter((item) => {
    return (
      item.lastCompleted !== null &&
      isAfter(new Date(item.lastCompleted), subYears(new Date(), 1)) &&
      !process.env.NEXT_PUBLIC_ALLOW_REPEAT_ASSESSMENTS
    );
  });

  const available = filteredBySearchTerm.filter((item) => !completed.includes(item));

  return { available, completed };
}
