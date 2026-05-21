import { PermissionDomainDefinition } from "../types/permissions";

export const SelfMonitoringPermissions = {
  MANAGE_SELF_MONITORING: "manage-self-monitoring",
} as const;

export const SelfMonitoringDomain: PermissionDomainDefinition = {
  domain: "self-monitoring",
  label: "Automonitoramento",
  permissions: [{ key: SelfMonitoringPermissions.MANAGE_SELF_MONITORING, label: "Gerenciar Automonitoramento" }],
};
