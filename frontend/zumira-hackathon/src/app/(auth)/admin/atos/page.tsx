import { Header } from "../components/header";
import { getActChatbots } from "./actions";
import { ActsList } from "./components/list";

export default async function Autoconhecimento() {
  const result = await getActChatbots();

  return (
    <div className="flex flex-col w-full">
      <Header title="Atos" create={{ href: "/admin/atos/novo", text: "Criar novo ato" }} />
      <ActsList data={result} />
    </div>
  );
}
