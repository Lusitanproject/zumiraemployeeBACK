import { z } from "zod";

export const PermissionItemSchema = z.object({
  key: z.string(),
  label: z.string(),
});

export const PermissionDomainResponseSchema = z.object({
  domain: z.string(),
  label: z.string(),
  permissions: z.array(PermissionItemSchema),
});

export type PermissionDomainResponse = z.infer<typeof PermissionDomainResponseSchema>;
