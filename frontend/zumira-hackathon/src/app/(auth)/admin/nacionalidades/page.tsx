import { Header } from "../components/header";
import { getNationalities } from "./actions";
import { NationalityList } from "./components/nationality-list";

export default async function Dimensoes() {
  const nationalities = await getNationalities();

  return (
    <div className="flex flex-col w-full">
      <Header create={{ text: "Nova nacionalidade", href: "/admin/nacionalidades/novo" }} title="Nacionalidades" />
      <NationalityList data={nationalities} />
    </div>
  );
}
