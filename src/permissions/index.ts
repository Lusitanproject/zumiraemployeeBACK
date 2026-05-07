export * from "./assessment";
export * from "./users";
export * from "./roles";
export * from "./company";

import { AssessmentPermissions } from "./assessment";
import { UserPermissions } from "./users";
import { RolePermissions } from "./roles";
import { CompanyPermissions } from "./company";

export const ALL_PERMISSIONS = Object.values({
  ...AssessmentPermissions,
  ...UserPermissions,
  ...RolePermissions,
  ...CompanyPermissions,
});

export type Permission = typeof ALL_PERMISSIONS[number];
