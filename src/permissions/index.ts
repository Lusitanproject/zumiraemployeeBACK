export * from "./acts";
export * from "./assessments";
export * from "./companies";
export * from "./dimensions";
export * from "./nationalities";
export * from "./notifications";
export * from "./psychosocial-factors";
export * from "./roles";
export * from "./self-monitoring";
export * from "./trails";
export * from "./users";

import { ActPermissions } from "./acts";
import { AssessmentPermissions } from "./assessments";
import { CompanyPermissions } from "./companies";
import { DimensionPermissions } from "./dimensions";
import { NationalityPermissions } from "./nationalities";
import { NotificationPermissions } from "./notifications";
import { PsychosocialFactorPermissions } from "./psychosocial-factors";
import { RolePermissions } from "./roles";
import { SelfMonitoringPermissions } from "./self-monitoring";
import { TrailPermissions } from "./trails";
import { UserPermissions } from "./users";

export const ALL_PERMISSIONS = Object.values({
  ...ActPermissions,
  ...AssessmentPermissions,
  ...CompanyPermissions,
  ...DimensionPermissions,
  ...NationalityPermissions,
  ...NotificationPermissions,
  ...PsychosocialFactorPermissions,
  ...RolePermissions,
  ...SelfMonitoringPermissions,
  ...TrailPermissions,
  ...UserPermissions,
});

export type Permission = (typeof ALL_PERMISSIONS)[number];
