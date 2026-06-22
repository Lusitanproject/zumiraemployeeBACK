import { PermissionDomainDefinition } from "../types/permissions";

export const ActPermissions = {
  ADMIN_MANAGE: "admin-acts-manage",
  ENGAGE: "acts-engage",
  READ_ANALYSIS_COMPANY: "acts-read-analysis-company",
  READ_ANALYSIS_OWNED: "acts-read-analysis-owned",
  READ_ANALYSIS_PLATFORM: "acts-read-analysis-platform",
  MANAGE_ANALYSIS: "acts-manage-analysis",
  CREATE: "acts-create",
  UPDATE_COMPANY: "acts-update-company",
  UPDATE_OWNED: "acts-update-owned",
  DELETE_COMPANY: "acts-delete-company",
  DELETE_OWNED: "acts-delete-owned",
  READ_COMPANY: "acts-read-company",
  READ_OWNED: "acts-read-owned",
  READ_PLATFORM: "acts-read-platform",
  READ_AVAILABLE: "acts-read-available",
  TEST: "acts-test",
} as const;

export const ActDomain: PermissionDomainDefinition = {
  domain: "acts",
  label: "Atos",
  permissions: [
    { key: ActPermissions.ADMIN_MANAGE, label: "Gerenciar Atos (Admin)" },
    { key: ActPermissions.ENGAGE, label: "Interagir com Atos" },
    { key: ActPermissions.READ_ANALYSIS_COMPANY, label: "Ver Análise de Atos da Empresa" },
    { key: ActPermissions.READ_ANALYSIS_OWNED, label: "Ver Análise de Atos Próprios" },
    { key: ActPermissions.READ_ANALYSIS_PLATFORM, label: "Ver Análise de Atos Zumira" },
    { key: ActPermissions.MANAGE_ANALYSIS, label: "Gerenciar Análise de Atos" },
    { key: ActPermissions.CREATE, label: "Criar Atos" },
    { key: ActPermissions.UPDATE_COMPANY, label: "Atualizar Atos da Empresa" },
    { key: ActPermissions.UPDATE_OWNED, label: "Atualizar Atos Próprios" },
    { key: ActPermissions.DELETE_COMPANY, label: "Deletar Atos da Empresa" },
    { key: ActPermissions.DELETE_OWNED, label: "Deletar Atos Próprios" },
    { key: ActPermissions.READ_COMPANY, label: "Listar Atos da Empresa" },
    { key: ActPermissions.READ_OWNED, label: "Listar Atos Próprios" },
    { key: ActPermissions.READ_PLATFORM, label: "Listar Atos Zumira" },
    { key: ActPermissions.READ_AVAILABLE, label: "Listar Atos Disponíveis" },
    { key: ActPermissions.TEST, label: "Testar Atos Próprio" },
  ],
};
