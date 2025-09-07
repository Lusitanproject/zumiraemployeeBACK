import { getCompanyData } from "./actions";
import { CompanyForm } from "./form";

export default async function ManageCompany({ params }: { params: Promise<{ companyId: string }> }) {
  const id = (await params).companyId;
  const company = await getCompanyData(id === "novo" ? null : id);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4">
        <h3 className="font-bold text-2xl text-text-700">{id === "novo" ? "Novo " : "Editar "}Empresa</h3>
      </div>
      <CompanyForm data={company} />
    </div>
  );
}
