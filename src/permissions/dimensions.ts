import { PermissionDomainDefinition } from "../types/permissions";

export const DimensionPermissions = {
  ADMIN_MANAGE: "admin-dimensions-manage",
} as const;

export const DimensionDomain: PermissionDomainDefinition = {
  domain: "dimensions",
  label: "Dimensões",
  permissions: [{ key: DimensionPermissions.ADMIN_MANAGE, label: "Gerenciar Dimensões (Admin)" }],
};
