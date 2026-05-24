import { PermissionDomainDefinition } from "../types/permissions";

export const PsychosocialFactorPermissions = {
  ADMIN_MANAGE: "admin-psychosocial-factors-manage",
} as const;

export const PsychosocialFactorDomain: PermissionDomainDefinition = {
  domain: "psychosocial-factors",
  label: "Fatores Psicossociais",
  permissions: [{ key: PsychosocialFactorPermissions.ADMIN_MANAGE, label: "Gerenciar Fatores Psicossociais (Admin)" }],
};
