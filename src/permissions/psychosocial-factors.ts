import { PermissionDomainDefinition } from "../types/permissions";

export const PsychosocialFactorPermissions = {
  MANAGE_PSYCHOSOCIAL_FACTORS: "manage-psychosocial-factors",
} as const;

export const PsychosocialFactorDomain: PermissionDomainDefinition = {
  domain: "psychosocial-factors",
  label: "Fatores Psicossociais",
  permissions: [
    { key: PsychosocialFactorPermissions.MANAGE_PSYCHOSOCIAL_FACTORS, label: "Gerenciar Fatores Psicossociais" },
  ],
};
