import { loadActChatbot } from "./actions";
import { ActChatbotProps } from "./form";

export default async function SelfMonitoringEdit({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const data = await loadActChatbot(id === "novo" ? null : id);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <h3 className="font-bold text-2xl text-gray-700">{id === "novo" ? "Novo " : "Editar "}Ato</h3>
      </div>
      <ActChatbotProps data={data} />
    </div>
  );
}
