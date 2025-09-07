import { z } from "zod";

export const CreateTrailSchema = z.object({
  title: z.string().nonempty(),
  subtitle: z.string().nonempty(),
  description: z.string().nonempty(),
});

export const UpdateTrailSchema = z.object({
  title: z.string().nonempty().optional(),
  subtitle: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
});

export type CreateTrailRequest = z.infer<typeof CreateTrailSchema>;
export type UpdateTrailRequest = z.infer<typeof UpdateTrailSchema> & { id: string };
