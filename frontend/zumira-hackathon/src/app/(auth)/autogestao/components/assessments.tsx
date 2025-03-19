"use client"
import { useSearchParams } from "next/navigation"
import { useFilteredAssessments } from "../lib"
import { Assessment, SelfMonitoringBlock } from "../definitions"
import { MonitoringBlocks } from "./monitoring-blocks"
import { SearchBar } from "./search-bar"
import { AssessmentList } from "./assessment-list"

type AssessmentsProps = {
  assessments: Assessment[]
  blocks: SelfMonitoringBlock[]
}

export function Assessments({ assessments, blocks }: AssessmentsProps) {
  const searchParams = useSearchParams()
  const term = searchParams.get("busca")
  const selfMonitoringBlockId = searchParams.get("avaliacao")

  const { available, completed } = useFilteredAssessments({
    data: assessments,
    term,
    selfMonitoringBlockId
  })

  return (
    <div className="pt-4">
      <SearchBar />
      <MonitoringBlocks data={blocks} />
      <div className="flex flex-col border-t border-gray-200 pt-8 mt-8  md:border-0">
        <AssessmentList
          title="Tarefas a realizar"
          data={available}
        />
        <AssessmentList
          title="Tarefas concluídas"
          data={completed}
          completed
        />
      </div>
    </div>
  )
}
