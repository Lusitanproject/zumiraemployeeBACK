import { getCompanies } from "./actions";
import { CompaniesList } from "./components/companies-list";
import { Header } from "./components/header";

export default async function Empresas() {
  const result = await getCompanies();

  return (
    <div className="flex flex-col w-full">
      <Header />
      <CompaniesList data={result} />
    </div>
  );
}
