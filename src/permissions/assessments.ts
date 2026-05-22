import { PermissionDomainDefinition } from "../types/permissions";

export const AssessmentPermissions = {
  ADMIN_MANAGE: "admin-assessments-manage",
  ENGAGE: "assessments-engage",
  READ_ANALYSIS: "assessments-read-analysis",
} as const;

export const AssessmentDomain: PermissionDomainDefinition = {
  domain: "assessments",
  label: "Avaliações",
  permissions: [
    { key: AssessmentPermissions.ADMIN_MANAGE, label: "Gerenciar Avaliações (Admin)" },
    { key: AssessmentPermissions.ENGAGE, label: "Interagir com Avaliações" },
    { key: AssessmentPermissions.READ_ANALYSIS, label: "Ver Análise de Avaliações" },
  ],
};
