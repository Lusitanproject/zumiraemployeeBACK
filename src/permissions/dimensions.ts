import { PermissionDomainDefinition } from "../types/permissions";

export const DimensionPermissions = {
  MANAGE_DIMENSION: "manage-dimension",
} as const;

export const DimensionDomain: PermissionDomainDefinition = {
  domain: "dimensions",
  label: "Dimensões",
  permissions: [{ key: DimensionPermissions.MANAGE_DIMENSION, label: "Gerenciar Dimensões" }],
};
