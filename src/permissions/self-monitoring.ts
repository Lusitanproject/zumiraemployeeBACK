import { PermissionDomainDefinition } from "../types/permissions";

export const SelfMonitoringPermissions = {
  ADMIN_MANAGE: "admin-self-monitoring-manage",
} as const;

export const SelfMonitoringDomain: PermissionDomainDefinition = {
  domain: "self-monitoring",
  label: "Automonitoramento",
  permissions: [{ key: SelfMonitoringPermissions.ADMIN_MANAGE, label: "Gerenciar Automonitoramento (Admin)" }],
};
