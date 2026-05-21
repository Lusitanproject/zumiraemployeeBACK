import { PermissionDomainDefinition } from "../types/permissions";

export const NationalityPermissions = {
  ADMIN_MANAGE: "admin-nationalities-manage",
} as const;

export const NationalityDomain: PermissionDomainDefinition = {
  domain: "nationalities",
  label: "Nacionalidades",
  permissions: [{ key: NationalityPermissions.ADMIN_MANAGE, label: "Gerenciar Nacionalidades (Admin)" }],
};
