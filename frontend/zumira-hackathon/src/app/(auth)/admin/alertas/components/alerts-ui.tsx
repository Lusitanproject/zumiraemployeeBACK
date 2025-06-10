"use client";

import { useState } from "react";
import { Assessment, Company, Filters as FiltersType, Result } from "../definitions";
import { AlertsTable } from "./alerts-table";
import { Filters } from "./filters";
import { getFilteredResults } from "../actions";

interface AlertsUIProps {
  assessments: Assessment[];
  companies: Company[];
}

export function AlertsUI({ assessments, companies }: AlertsUIProps) {
  const [results, setResults] = useState<Result[]>();
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchResults(data: FiltersType) {
    setLoading(true);
    const newData = await getFilteredResults(data);
    setResults(newData);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <Filters
          assessments={assessments}
          companies={companies}
          onChangeFilters={fetchResults}
          totalResults={results?.length}
        />
      </div>
      <div className="flex flex-col gap-2">
        <AlertsTable results={results} loading={loading} />
      </div>
    </div>
  );
}
