"use client";

import { useRef, useState } from "react";

import { getFilteredResults } from "../actions";
import { Assessment, Company, Filters as FiltersType, Result } from "../definitions";
import { AlertsTable } from "./alerts-table";
import { Filters } from "./filters";

interface AlertsUIProps {
  assessments: Assessment[];
  companies: Company[];
}

export function AlertsUI({ assessments, companies }: AlertsUIProps) {
  const [results, setResults] = useState<Result[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const filters = useRef<FiltersType>(undefined);

  async function fetchResults(data: FiltersType) {
    setLoading(true);
    const newData = await getFilteredResults(data);
    setResults(newData);
    setLoading(false);
  }

  async function handleChangeFilters(data: FiltersType) {
    filters.current = data;
    await fetchResults(data);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <Filters
          assessments={assessments}
          companies={companies}
          totalResults={results?.length}
          onChangeFilters={handleChangeFilters}
        />
      </div>
      <div className="flex flex-col gap-2">
        <AlertsTable loading={loading} results={results} filters={filters.current} />
      </div>
    </div>
  );
}
