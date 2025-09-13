import { getActChatbot } from "@/api/acts";

import { Playground } from "./components/playground";
import { getTrailsAdmin } from "@/api/trails";

export default async function ActsEdit({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ trailId: string }>;
}) {
  const { id } = await params;
  const { trailId } = await searchParams;
  const data = await getActChatbot(id === "novo" ? null : id);
  const trails = await getTrailsAdmin();

  return (
    <div className="flex flex-col size-full">
      <div className="flex items-center justify-between pb-4 border-b border-border-100">
        <h3 className="font-bold text-2xl text-text-700">{id === "novo" ? "Novo " : "Editar "}Ato</h3>
      </div>
      <Playground defaultTrailId={trailId} data={data} trails={trails} />
    </div>
  );
}
