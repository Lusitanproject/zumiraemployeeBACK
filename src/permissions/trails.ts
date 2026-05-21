import { PermissionDomainDefinition } from "../types/permissions";

export const TrailPermissions = {
  MANAGE_TRAILS: "manage-trails",
} as const;

export const TrailDomain: PermissionDomainDefinition = {
  domain: "trails",
  label: "Trilhas",
  permissions: [
    { key: TrailPermissions.MANAGE_TRAILS, label: "Gerenciar Trilhas" },
  ],
};
