import { getAssessments, getAssessmentsAdmin } from "@/api/assessments";
import { SelectAssessments } from "./select-assessments";
import { getCompanyData } from "../actions";
import { redirect } from "next/navigation";
import { getCompany } from "@/api/companies";
import { Company } from "@/types/company";

export default async function ManageCompanyAssessments({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const assessments = await getAssessmentsAdmin();
  const company = await getCompany(companyId);

  if (!company) redirect("/not-found");

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center justify-between py-4">
        <h3 className="font-bold text-2xl text-text-700">Testes da Empresa</h3>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <SelectAssessments assessments={assessments} company={company} />
      </div>
    </div>
  );
}
