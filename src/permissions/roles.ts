import { PermissionDomainDefinition } from "../types/permissions";

export const RolePermissions = {
  MANAGE_ROLES: "manage-roles",
} as const;

export const RoleDomain: PermissionDomainDefinition = {
  domain: "roles",
  label: "Perfis",
  permissions: [{ key: RolePermissions.MANAGE_ROLES, label: "Gerenciar Perfis" }],
};
