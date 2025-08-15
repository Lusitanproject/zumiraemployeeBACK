"use client";
import { useSearchParams } from "next/navigation";

import { Assessment, SelfMonitoringBlock } from "../definitions";
import { useFilteredAssessments } from "../lib";
import { AssessmentList } from "./assessment-list";
import { MonitoringBlocks } from "./monitoring-blocks";
import { SearchBar } from "./search-bar";

type AssessmentsProps = {
  assessments: Assessment[];
  blocks: SelfMonitoringBlock[];
};

export function Assessments({ assessments, blocks }: AssessmentsProps) {
  const searchParams = useSearchParams();
  const term = searchParams.get("busca");
  const selfMonitoringBlockId = searchParams.get("avaliacao");

  const { available, completed } = useFilteredAssessments({
    data: assessments,
    term,
    selfMonitoringBlockId,
  });

  return (
    <div className="pt-4">
      <SearchBar />
      <MonitoringBlocks data={blocks} />
      <div className="flex flex-col border-t border-border-200 pt-8 mt-8  md:border-0">
        {available.length || completed.length ? (
          <>
            <AssessmentList data={available} title="Avaliações a realizar" />
            <AssessmentList completed data={completed} title="Minhas avaliações" />
          </>
        ) : (
          <span className="text-text-600 text-center">Não foram encontrados resultados para a sua busca</span>
        )}
      </div>
    </div>
  );
}
