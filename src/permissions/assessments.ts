import type { Permission } from "./index";

import { PermissionDomainDefinition } from "../types/permissions";

export const AssessmentPermissions = {
  ADMIN_MANAGE: "admin-assessments-manage",
  ENGAGE: "assessments-engage",
  READ_ANALYSIS_COMPANY: "assessments-read-analysis-company",
  READ_ANALYSIS_OWNED: "assessments-read-analysis-owned",
  READ_ANALYSIS_PLATFORM: "assessments-read-analysis-platform",
  CREATE: "assessments-create",
  UPDATE_COMPANY: "assessments-update-company",
  UPDATE_OWNED: "assessments-update-owned",
  DELETE_COMPANY: "assessments-delete-company",
  DELETE_OWNED: "assessments-delete-owned",
  READ_COMPANY: "assessments-read-company",
  READ_OWNED: "assessments-read-owned",
  READ_PLATFORM: "assessments-read-platform",
} as const;

export const AssessmentDomain: PermissionDomainDefinition = {
  domain: "assessments",
  label: "Avaliações",
  permissions: [
    { key: AssessmentPermissions.ADMIN_MANAGE, label: "Gerenciar Avaliações (Admin)" },
    { key: AssessmentPermissions.ENGAGE, label: "Interagir com Avaliações" },
    { key: AssessmentPermissions.READ_ANALYSIS_COMPANY, label: "Ver Análise de Avaliações da Empresa" },
    { key: AssessmentPermissions.READ_ANALYSIS_OWNED, label: "Ver Análise de Avaliações Próprias" },
    { key: AssessmentPermissions.READ_ANALYSIS_PLATFORM, label: "Ver Análise de Avaliações Zumira" },
    { key: AssessmentPermissions.CREATE, label: "Criar Avaliações" },
    { key: AssessmentPermissions.UPDATE_COMPANY, label: "Atualizar Avaliações da Empresa" },
    { key: AssessmentPermissions.UPDATE_OWNED, label: "Atualizar Avaliações Próprias" },
    { key: AssessmentPermissions.DELETE_COMPANY, label: "Deletar Avaliações da Empresa" },
    { key: AssessmentPermissions.DELETE_OWNED, label: "Deletar Avaliações Próprias" },
    { key: AssessmentPermissions.READ_COMPANY, label: "Listar Avaliações da Empresa" },
    { key: AssessmentPermissions.READ_OWNED, label: "Listar Avaliações Próprias" },
    { key: AssessmentPermissions.READ_PLATFORM, label: "Listar Avaliações Zumira" },
  ],
};

export const ASSESSMENT_AUTHORING_PERMISSIONS: Permission[] = [
  AssessmentPermissions.CREATE,
  AssessmentPermissions.UPDATE_COMPANY,
  AssessmentPermissions.UPDATE_OWNED,
];
