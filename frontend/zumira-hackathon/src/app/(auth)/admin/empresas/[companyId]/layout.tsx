import { ReactNode } from "react";

import { Tabs } from "@/components/ui/tabs";

import { getCompanyData } from "./actions";

interface CompanyLayoutProps {
  children: ReactNode;
  params: Promise<{ companyId: string }>;
}

export default async function CompanyLayout({ params, children }: CompanyLayoutProps) {
  const companyId = (await params).companyId;
  const data = await getCompanyData(companyId === "novo" ? null : companyId);

  const tabs = [
    { label: "Detalhes", href: `/admin/empresas/${companyId}` },
    { label: "Testes", href: `/admin/empresas/${companyId}/testes`, disabled: companyId === "novo" },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <h3 className="font-semibold text-base text-text-300">{companyId === "novo" ? "Nova empresa" : data?.name}</h3>
      <Tabs items={tabs} />
      <div className="flex-1 min-h-0 w-full">{children}</div>
    </div>
  );
}
