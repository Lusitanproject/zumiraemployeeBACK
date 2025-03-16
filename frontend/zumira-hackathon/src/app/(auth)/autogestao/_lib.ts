import { subYears, isAfter } from "date-fns"
import { Assessment } from "./definitions"

type FilterProps = {
  selfMonitoringBlockId: string | null
  term: string | null
  data: Assessment[]
}

type ParsedAssessmentList = {
  completed: Assessment[]
  available: Assessment[]
}

export function useFilteredAssessments({ data, selfMonitoringBlockId, term }: FilterProps) {
  const filteredBySelfMonitoring = selfMonitoringBlockId ? data.filter(item => item.selfMonitoring.id === selfMonitoringBlockId) : data
  const filteredBySearchTerm = term ? filteredBySelfMonitoring.filter(item => item.title.toLowerCase().indexOf(term.toLowerCase()) !== -1) : filteredBySelfMonitoring

  const filtered = filteredBySearchTerm.reduce<ParsedAssessmentList>((previous, current) => {
    if (current.lastCompleted === null || !isAfter(subYears(new Date(current.lastCompleted), 1), subYears(new Date, 1)) ) {
      return { ...previous, completed: [...previous.completed, current] }
    }

    return { ...previous, available: [...previous.available, current] }
  }, { completed: [], available: []})

  return filtered
}
