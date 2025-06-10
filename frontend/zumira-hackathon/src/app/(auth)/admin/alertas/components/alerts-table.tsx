import { Spinner } from "@/components/custom/spinner";
import { Result } from "../definitions";
import { MeatballsMenu } from "./meatballs-menu";

interface AlertsTableProps {
  results?: Result[];
  loading?: boolean;
}

export function AlertsTable({ results, loading }: AlertsTableProps) {
  function formatDate(date: Date) {
    return `${date.getDay()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
  }

  if (loading || results === undefined) {
    return (
      <span className="flex w-full text-center justify-center text-gray-500 bg-gray-100 rounded-xl p-1.5 border-1 border-gray-300">
        <Spinner size="xl" color="var(--color-gray-300)" />
      </span>
    );
  }

  if (!results.length) {
    return (
      <span className="w-full text-center text-gray-500 bg-gray-100 rounded-xl p-1.5 border-1 border-gray-300">
        Sem resultados
      </span>
    );
  }

  const sample = results.length ? results[0] : null;

  return (
    <div className="rounded-xl border-1 border-gray-300">
      <table className="min-w-full text-sm text-center rounded-xl overflow-clip">
        <thead className="bg-gray-100 text-gray-500 font-semibold">
          <tr>
            <th className="p-2">Código</th>
            <th className="p-2">Perfil</th>
            {sample &&
              sample.scores.map((score) => (
                <td key={score.dimension.id} className="p-2">
                  Escore {score.dimension.acronym}
                </td>
              ))}
            <th className="p-2">Ultima avaliação</th>
            <th className="p-2">Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => {
            return (
              <tr key={result.id} className="border-b border-gray-200">
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
                  <MeatballsMenu username={result.user.name} email={result.user.email} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
