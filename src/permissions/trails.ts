import { PermissionDomainDefinition } from "../types/permissions";

export const TrailPermissions = {
  ADMIN_MANAGE: "admin-trails-manage",
} as const;

export const TrailDomain: PermissionDomainDefinition = {
  domain: "trails",
  label: "Trilhas",
  permissions: [{ key: TrailPermissions.ADMIN_MANAGE, label: "Gerenciar Trilhas (Admin)" }],
};
