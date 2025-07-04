import { ReactNode } from "react";

import { getAssessments } from "@/api/assessments";
import { getCompanies } from "@/api/companies";
import { AlertsProvider } from "@/providers/alerts";

interface LayoutProps {
  children: ReactNode;
}

export default async function AlertsLayout({ children }: LayoutProps) {
  const assessments = await getAssessments();
  const companies = await getCompanies();

  return (
    <div className="flex flex-col size-full">
      <AlertsProvider assessments={assessments} companies={companies}>
        {children}
      </AlertsProvider>
    </div>
  );
}
