"use client";

import { ReactNode } from "react";

import { Tabs } from "@/components/ui/tabs";
import { Assessment } from "@/types/assessment";
import { Company } from "@/types/company";

import { Filters } from "./filters";

interface AlertsUIProps {
  assessments: Assessment[];
  companies: Company[];
  children?: ReactNode;
}

export function AlertsUI({ assessments, children, companies }: AlertsUIProps) {
  const tabs = [
    { label: "Alertas", href: `/admin/alertas` },
    { label: "Relatório", href: `/admin/alertas/relatorio` },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Filters assessments={assessments} companies={companies} />
      <Tabs items={tabs} />
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
