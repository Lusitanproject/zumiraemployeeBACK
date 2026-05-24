import { PermissionDomainDefinition } from "../types/permissions";

export const UserPermissions = {
  ADMIN_MANAGE: "admin-users-manage",
} as const;

export const UserDomain: PermissionDomainDefinition = {
  domain: "users",
  label: "Usuários",
  permissions: [{ key: UserPermissions.ADMIN_MANAGE, label: "Gerenciar Usuários (Admin)" }],
};
