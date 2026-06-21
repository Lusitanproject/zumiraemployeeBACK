import { ALL_PERMISSIONS, Permission } from "../permissions";

export function hasPermission(user: { role: string; permissions: string[] }, permission: Permission): boolean {
  return user.role === "admin" || user.permissions.includes(permission);
}

export function partitionPermissions(permissions: string[]): {
  valid: Permission[];
  invalid: string[];
} {
  const valid: Permission[] = [];
  const invalid: string[] = [];

  for (const permission of permissions) {
    if (ALL_PERMISSIONS.includes(permission as Permission)) {
      valid.push(permission as Permission);
    } else {
      invalid.push(permission);
    }
  }

  return { valid, invalid };
}
