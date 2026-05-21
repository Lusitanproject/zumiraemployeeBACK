import { PermissionDomainDefinition } from "../types/permissions";

export const ActPermissions = {
  ADMIN_MANAGE: "admin-acts-manage",
  ENGAGE: "acts-engage",
  READ_ANALYSIS: "acts-read-analysis",
} as const;

export const ActDomain: PermissionDomainDefinition = {
  domain: "acts",
  label: "Atos",
  permissions: [
    { key: ActPermissions.ADMIN_MANAGE, label: "Gerenciar Atos (Admin)" },
    { key: ActPermissions.ENGAGE, label: "Interagir com Atos" },
    { key: ActPermissions.READ_ANALYSIS, label: "Ver Análise de Atos" },
  ],
};
