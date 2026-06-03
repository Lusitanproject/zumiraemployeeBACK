import { PermissionDomainDefinition } from "../types/permissions";

export const CompanyPermissions = {
  ADMIN_MANAGE: "admin-companies-manage",
  READ: "companies-read",
  USERS_READ: "company-users-read",
  USERS_WRITE: "company-users-write",
  USERS_UPDATE: "company-users-update",
  USERS_DELETE: "company-users-delete",
  ACCESS_DASHBOARD: "company-access-dashboard",
} as const;

export const CompanyDomain: PermissionDomainDefinition = {
  domain: "companies",
  label: "Empresas",
  permissions: [
    { key: CompanyPermissions.ADMIN_MANAGE, label: "Gerenciar Empresas (Admin)" },
    { key: CompanyPermissions.READ, label: "Ver Empresa" },
    { key: CompanyPermissions.USERS_READ, label: "Ver Usuários da Empresa" },
    { key: CompanyPermissions.USERS_WRITE, label: "Adicionar Usuários à Empresa" },
    { key: CompanyPermissions.USERS_UPDATE, label: "Atualizar Usuários da Empresa" },
    { key: CompanyPermissions.USERS_DELETE, label: "Remover Usuários da Empresa" },
    { key: CompanyPermissions.ACCESS_DASHBOARD, label: "Acessar Dashboard da Empresa" },
  ],
};
