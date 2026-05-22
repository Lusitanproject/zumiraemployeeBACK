import { PermissionDomainDefinition } from "../types/permissions";

export const RolePermissions = {
  ADMIN_MANAGE: "admin-roles-manage",
} as const;

export const RoleDomain: PermissionDomainDefinition = {
  domain: "roles",
  label: "Perfis",
  permissions: [{ key: RolePermissions.ADMIN_MANAGE, label: "Gerenciar Perfis (Admin)" }],
};
