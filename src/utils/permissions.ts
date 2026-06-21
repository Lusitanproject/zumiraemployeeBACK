import { Permission } from "../permissions";

export function hasPermission(user: { role: string; permissions: string[] }, permission: Permission): boolean {
  return user.role === "admin" || user.permissions.includes(permission);
}
