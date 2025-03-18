import { getCompanies } from "./actions";
import { Header } from "./components/header";
import { CompaniesList } from "./components/companies-list";

export default async function Empresas() {
  const result = await getCompanies()

  return (
    <div className="flex flex-col w-full">
      <Header />
      <CompaniesList data={result} />
    </div>
  )
}
