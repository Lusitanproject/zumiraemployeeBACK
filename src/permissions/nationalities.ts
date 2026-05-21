import { PermissionDomainDefinition } from "../types/permissions";

export const NationalityPermissions = {
  MANAGE_NATIONALITIES: "manage-nationalities",
} as const;

export const NationalityDomain: PermissionDomainDefinition = {
  domain: "nationalities",
  label: "Nacionalidades",
  permissions: [
    { key: NationalityPermissions.MANAGE_NATIONALITIES, label: "Gerenciar Nacionalidades" },
  ],
};
