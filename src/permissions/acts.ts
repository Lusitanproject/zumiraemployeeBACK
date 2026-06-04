import { PermissionDomainDefinition } from "../types/permissions";

export const ActPermissions = {
  ADMIN_MANAGE: "admin-acts-manage",
  ENGAGE: "acts-engage",
  READ_ANALYSIS: "acts-read-analysis",
  CREATE: "acts-create",
  UPDATE: "acts-update",
  DELETE: "acts-delete",
  READ_OWNED: "acts-read-owned",
  READ_AVAILABLE: "acts-read-available",
} as const;

export const ActDomain: PermissionDomainDefinition = {
  domain: "acts",
  label: "Atos",
  permissions: [
    { key: ActPermissions.ADMIN_MANAGE, label: "Gerenciar Atos (Admin)" },
    { key: ActPermissions.ENGAGE, label: "Interagir com Atos" },
    { key: ActPermissions.READ_ANALYSIS, label: "Ver Análise de Atos" },
    { key: ActPermissions.CREATE, label: "Criar Atos" },
    { key: ActPermissions.UPDATE, label: "Atualizar Atos Próprios" },
    { key: ActPermissions.DELETE, label: "Deletar Atos Próprios" },
    { key: ActPermissions.READ_OWNED, label: "Listar Atos Próprios" },
    { key: ActPermissions.READ_AVAILABLE, label: "Listar Atos Disponíveis" },
  ],
};
