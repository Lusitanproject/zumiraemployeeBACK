import { PermissionDomainDefinition } from "../types/permissions";

export const NotificationPermissions = {
  ADMIN_MANAGE: "admin-notifications-manage",
} as const;

export const NotificationDomain: PermissionDomainDefinition = {
  domain: "notifications",
  label: "Notificações",
  permissions: [{ key: NotificationPermissions.ADMIN_MANAGE, label: "Gerenciar Notificações (Admin)" }],
};
