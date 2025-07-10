"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getAssessmentResultsFiltered } from "@/api/assessments";
import { AssessmentResult } from "@/types/assessment";

import { AlertsTable } from "./components/alerts-table";
import { Filters } from "./definitions";

export default function Alertas() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment");
  const companyId = searchParams.get("company");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const [results, setResults] = useState<AssessmentResult[]>();
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchResults(data: Filters) {
    setLoading(true);
    const newData = await getAssessmentResultsFiltered(data);
    setResults(newData);
    setLoading(false);
  }

  useEffect(() => {
    if (!assessmentId) return;
    fetchResults({
      assessmentId,
      companyId: companyId || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
  }, [assessmentId, companyId, dateFrom, dateTo]);

  return (
    <div className="flex size-full flex-col gap-2">
      <AlertsTable loading={loading} results={results} />
    </div>
  );
}
