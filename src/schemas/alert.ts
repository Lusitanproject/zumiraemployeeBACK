import { z } from "zod";

export const ListAlertsSchema = z.object({
  filter: z.enum(["recent", "unread"] as const),
  max: z.coerce.number().int().positive().optional(),
});

export const ReadAlertSchema = z.object({
  id: z.string().uuid(),
});

export type ListAlertsRequest = z.infer<typeof ListAlertsSchema> & { userId: string };
export type ReadAlertRequest = z.infer<typeof ReadAlertSchema>;
