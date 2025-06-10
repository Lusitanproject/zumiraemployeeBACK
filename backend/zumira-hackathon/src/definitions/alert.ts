import { z } from "zod";

export const ReadAlertSchema = z.object({
  id: z.string().uuid(),
});

export type ReadAlertRequest = z.infer<typeof ReadAlertSchema>;
