import { loadSelfMonitoringBlock } from "./actions";
import { SelfMonitoringBlockForm } from "./form";

export default async function SelfMonitoringEdit({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const data = await loadSelfMonitoringBlock(id === "novo" ? null : id);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <h3 className="font-bold text-2xl text-gray-700">
          {id === "novo" ? "Novo " : "Editar "}Bloco de Autoconhecimento
        </h3>
      </div>
      <SelfMonitoringBlockForm data={data} />
    </div>
  );
}
