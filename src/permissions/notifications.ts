import { PermissionDomainDefinition } from "../types/permissions";

export const NotificationPermissions = {
  MANAGE_NOTIFICATIONS: "manage-notifications",
} as const;

export const NotificationDomain: PermissionDomainDefinition = {
  domain: "notifications",
  label: "Notificações",
  permissions: [
    { key: NotificationPermissions.MANAGE_NOTIFICATIONS, label: "Gerenciar Notificações" },
  ],
};
