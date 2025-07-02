import { getActChatbot } from "@/api/acts";

import { Playground } from "./components/playground";

export default async function SelfMonitoringEdit({ params }: { params: Promise<{ id: string }> }) {
  const chatbotId = (await params).id;
  const data = await getActChatbot(chatbotId === "novo" ? null : chatbotId);

  return (
    <div className="flex flex-col size-full">
      <div className="flex items-center justify-between pb-4 border-b border-border-100">
        <h3 className="font-bold text-2xl text-text-700">{chatbotId === "novo" ? "Novo " : "Editar "}Ato</h3>
      </div>
      <Playground data={data} />
    </div>
  );
}
