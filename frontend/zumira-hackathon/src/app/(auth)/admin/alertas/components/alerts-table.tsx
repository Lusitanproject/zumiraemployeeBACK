"use client";

import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { downloadAssessmentResultsReport } from "@/api/assessments";
import { Spinner } from "@/components/custom/spinner";
import { AssessmentResult } from "@/types/assessment";

import { Filters } from "../definitions";
import { MeatballsMenu } from "./meatballs-menu";

interface AlertsTableProps {
  loading?: boolean;
  results?: AssessmentResult[];
}

export function AlertsTable({ results, loading }: AlertsTableProps) {
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment");
  const companyId = searchParams.get("company");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const filters: Filters = {
    assessmentId: assessmentId || "",
    companyId: companyId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  };

  function formatDate(date: Date) {
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  }

  // TODO: aplicar esses filtros no backend
  function filterResultsByDate(results: AssessmentResult[]) {
    if (!dateFrom && !dateTo) return results;

    return results.filter((result) => {
      const resultDate = new Date(result.createdAt);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      if (fromDate && resultDate < fromDate) return false;
      if (toDate && resultDate > toDate) return false;

      return true;
    });
  }

  async function downloadReport() {
    try {
      const { blob, filename } = await downloadAssessmentResultsReport(filters);
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  }

  if (loading || results === undefined) {
    return (
      <span className="flex w-full text-center justify-center text-text-500 bg-background-100 rounded-xl p-1.5 border-1 border-border-300">
        <Spinner color="var(--color-gray-300)" size="xl" />
      </span>
    );
  }

  if (!results.length) {
    return (
      <span className="w-full text-center text-text-500 bg-background-100 rounded-xl p-1.5 border-1 border-border-300">
        Sem resultados
      </span>
    );
  }

  const filteredResults = filterResultsByDate(results);

  if (!filteredResults.length) {
    return (
      <span className="w-full text-center text-text-500 bg-background-100 rounded-xl p-1.5 border-1 border-border-300">
        Nenhum resultado encontrado para o período selecionado
      </span>
    );
  }

  const sample = filteredResults.length ? filteredResults[0] : null;

  return (
    <div className="rounded-xl border-1 border-border-300">
      <table className="min-w-full text-sm text-center rounded-xl overflow-clip">
        <thead className="bg-background-100 text-text-500 font-semibold">
          <tr>
            <th className="p-2">Código</th>
            <th className="p-2">Perfil</th>
            {sample &&
              sample.scores.map((score) => (
                <th key={score.dimension.id} className="p-2">
                  Escore {score.dimension.acronym}
                </th>
              ))}
            <th className="p-2">Ultima avaliação</th>
            <th className="p-2">Status</th>
            <th>
              <button className="flex size-fit cursor-pointer" title="Baixar relatório" onClick={downloadReport}>
                <Download className="size-4.5" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="text-text-700">
          {filteredResults.map((result, index) => {
            return (
              <tr key={result.id} className="border-b border-border-200">
                <td className="p-2">{`C-${String(index + 1).padStart(3, "0")}`}</td>
                <td className="p-2">{result.assessmentResultRating.profile}</td>
                {result.scores.map((score) => (
                  <td key={score.dimension.id} className="p-2">
                    {score.value.toFixed(2)}
                  </td>
                ))}
                <td className="p-2">{formatDate(new Date(result.createdAt))}</td>
                <td className="p-2 flex flex-row items-center justify-center gap-3">
                  <div
                    className="size-2 rounded-full flex-none"
                    style={{ backgroundColor: result.assessmentResultRating.color }}
                  />
                  {result.assessmentResultRating.risk}
                  <div className="size-2 flex-none" />
                </td>
                <td className="pr-2">
                  <MeatballsMenu email={result.user.email} username={result.user.name} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
