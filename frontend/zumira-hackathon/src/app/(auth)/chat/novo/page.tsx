import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";

import { getActsData } from "../../actions";
import { ActSelector } from "./components/act-selector";

export default async function Novo() {
  const data = await getActsData();
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  if (!data.chatbots.length || !session) {
    return (
      <div className="flex size-full justify-center items-center text-gray-400">Não há atos disponíveis no momento</div>
    );
  }

  return <ActSelector currentAct={session.act} data={data} />;
}
