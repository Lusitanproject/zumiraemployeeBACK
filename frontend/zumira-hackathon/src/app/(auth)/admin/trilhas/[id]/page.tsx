import { getTrailData } from "@/api/trails";
import { TrailForm } from "./form";

export default async function ManageNationality({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trail = id !== "novo" ? await getTrailData(id) : null;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-border-100">
        <h3 className="font-bold text-2xl text-text-700">{id === "novo" ? "Novo " : "Editar "}Trilha</h3>
      </div>
      <TrailForm data={trail} />
    </div>
  );
}
