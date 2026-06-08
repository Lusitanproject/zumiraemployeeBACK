import { z } from "zod";

export const UpdateSystemConfigSchema = z.object({
  reportUnavailableInstructions: z.string(),
});

export type UpdateSystemConfigRequest = z.infer<typeof UpdateSystemConfigSchema>;
