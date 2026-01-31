import { z } from "zod";

export const CreateNationalitySchema = z.object({
  acronym: z.string().min(2).max(5),
  name: z.string().min(2).max(100),
});

export const UpdateNationalitySchema = CreateNationalitySchema;

export type CreateNationalityRequest = z.infer<typeof CreateNationalitySchema>;
export type UpdateNationalityRequest = z.infer<typeof UpdateNationalitySchema> & { id: string };
