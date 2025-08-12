import { isAfter, subYears } from "date-fns";

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

  let filteredBySearchTerm = filteredBySelfMonitoring;

  if (term) {
    const termLower = term.toLowerCase();

    // Separa os resultados em dois grupos: com match no título e com match no sumário
    const titleMatches = filteredBySelfMonitoring.filter((item) => item.title.toLowerCase().indexOf(termLower) !== -1);

    const summaryMatches = filteredBySelfMonitoring.filter(
      (item) =>
        item.title.toLowerCase().indexOf(termLower) === -1 && // Não está no título
        item.summary.toLowerCase().indexOf(termLower) !== -1
    );

    // Prioriza resultados com match no título, depois com match no sumário
    filteredBySearchTerm = [...titleMatches, ...summaryMatches];
  }

  const completed = filteredBySearchTerm.filter((item) => {
    return (
      item.lastCompleted !== null &&
      isAfter(new Date(item.lastCompleted), subYears(new Date(), 1)) &&
      !(process.env.NEXT_PUBLIC_ALLOW_REPEAT_ASSESSMENTS === "true")
    );
  });

  const available = filteredBySearchTerm.filter((item) => !completed.includes(item));

  return { available, completed };
}
