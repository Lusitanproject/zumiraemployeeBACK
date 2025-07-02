import { ReactNode } from "react";

import { Tabs } from "../../components/tabs";
import { getAssessmentData } from "./actions";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ assessmentId: string }>;
}

export default async function AssessmentLayout({ params, children }: LayoutProps) {
  const assessmentId = (await params).assessmentId;
  const data = await getAssessmentData(assessmentId === "novo" ? null : assessmentId);

  const tabs = [
    { label: "Detalhes", href: `/admin/testes/${assessmentId}` },
    { label: "Perguntas", href: `/admin/testes/${assessmentId}/perguntas`, disabled: assessmentId === "novo" },
    {
      label: "Classificações",
      href: `/admin/testes/${assessmentId}/classificacoes`,
      disabled: assessmentId === "novo",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <h3 className="font-semibold text-base text-text-300">{assessmentId === "novo" ? "Novo teste" : data?.title}</h3>
      <Tabs items={tabs} />
      {children}
    </div>
  );
}
