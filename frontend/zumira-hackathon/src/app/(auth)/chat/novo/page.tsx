import { getActsData } from "@/api/acts";

import { ActSelector } from "./components/act-selector";

export default async function Novo() {
  const data = await getActsData();

  if (!data.chatbots.length) {
    return (
      <div className="flex size-full justify-center items-center text-text-400">Não há atos disponíveis no momento</div>
    );
  }

  return <ActSelector data={data} />;
}
