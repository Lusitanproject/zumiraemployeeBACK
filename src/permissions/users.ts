import { PermissionDomainDefinition } from "../types/permissions";

export const UserPermissions = {
  MANAGE_USERS: "manage-users",
} as const;

export const UserDomain: PermissionDomainDefinition = {
  domain: "users",
  label: "Usuários",
  permissions: [
    { key: UserPermissions.MANAGE_USERS, label: "Gerenciar Usuários" },
  ],
};
