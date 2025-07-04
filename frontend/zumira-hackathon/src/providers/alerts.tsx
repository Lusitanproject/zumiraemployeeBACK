"use client";

import { createContext, ReactNode, useState } from "react";

import { AlertsUI } from "@/app/(auth)/admin/alertas/components/alerts-ui";
import { Assessment } from "@/types/assessment";
import { Company } from "@/types/company";

type AlertsContextData = {
  assessmentId?: string;
  companyId?: string;
  setAssessmentId: (assessmentId: string) => void;
  setCompanyId: (companyId: string) => void;
};

type AlertsProviderProps = {
  assessments: Assessment[];
  companies: Company[];
  children: ReactNode;
};

export const AlertsContext = createContext({} as AlertsContextData);

export function AlertsProvider({ children, assessments, companies }: AlertsProviderProps) {
  const [assessmentId, setAssessmentId] = useState<string>(assessments[0]?.id);
  const [companyId, setCompanyId] = useState<string>(companies[0]?.id);

  return (
    <AlertsContext.Provider
      value={{
        assessmentId,
        setAssessmentId,
        companyId,
        setCompanyId,
      }}
    >
      <AlertsUI assessments={assessments} companies={companies}>
        {children}
      </AlertsUI>
    </AlertsContext.Provider>
  );
}
