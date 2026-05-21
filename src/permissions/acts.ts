import { PermissionDomainDefinition } from "../types/permissions";

export const ActPermissions = {
  ANSWER_ACT: "answer-act",
  MANAGE_ACTS: "manage-acts",
  VIEW_ACT_ANALYSIS: "view-act-analysis",
} as const;

export const ActDomain: PermissionDomainDefinition = {
  domain: "acts",
  label: "Atos",
  permissions: [
    { key: ActPermissions.ANSWER_ACT, label: "Responder Ato" },
    { key: ActPermissions.MANAGE_ACTS, label: "Gerenciar Atos" },
    { key: ActPermissions.VIEW_ACT_ANALYSIS, label: "Ver Análise de Atos" },
  ],
};
