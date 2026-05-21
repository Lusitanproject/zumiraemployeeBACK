import { PermissionDomainDefinition } from "../types/permissions";

export const CompanyPermissions = {
  MANAGE_COMPANY: "manage-company",
  VIEW_COMPANY_USERS: "view-company-users",
} as const;

export const CompanyDomain: PermissionDomainDefinition = {
  domain: "companies",
  label: "Empresas",
  permissions: [
    { key: CompanyPermissions.MANAGE_COMPANY, label: "Gerenciar Empresa" },
    { key: CompanyPermissions.VIEW_COMPANY_USERS, label: "Ver Usuários da Empresa" },
  ],
};
