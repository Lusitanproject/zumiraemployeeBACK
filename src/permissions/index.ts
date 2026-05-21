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

import { ActDomain } from "./acts";
import { AssessmentDomain } from "./assessments";
import { CompanyDomain } from "./companies";
import { DimensionDomain } from "./dimensions";
import { NationalityDomain } from "./nationalities";
import { NotificationDomain } from "./notifications";
import { PsychosocialFactorDomain } from "./psychosocial-factors";
import { RoleDomain } from "./roles";
import { SelfMonitoringDomain } from "./self-monitoring";
import { TrailDomain } from "./trails";
import { UserDomain } from "./users";
import { PermissionDomainDefinition } from "../types/permissions";

export const PERMISSION_DOMAINS: PermissionDomainDefinition[] = [
  ActDomain,
  AssessmentDomain,
  CompanyDomain,
  DimensionDomain,
  NationalityDomain,
  NotificationDomain,
  PsychosocialFactorDomain,
  RoleDomain,
  SelfMonitoringDomain,
  TrailDomain,
  UserDomain,
];

export const ALL_PERMISSIONS = PERMISSION_DOMAINS.flatMap((d) => d.permissions.map((p) => p.key));

export type Permission = (typeof ALL_PERMISSIONS)[number];
