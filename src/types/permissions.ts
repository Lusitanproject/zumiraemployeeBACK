export interface PermissionItem {
  key: string;
  label: string;
}

export interface PermissionDomainDefinition {
  domain: string;
  label: string;
  permissions: PermissionItem[];
}

