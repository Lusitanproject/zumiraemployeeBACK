import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  trailId: z.string().cuid(),
});

export const UpdateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  trailId: z.string().cuid().optional(),
});

export const FindCompanySchema = z.object({
  id: z.string().cuid(),
});

export type CreateCompanyRequest = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyRequest = z.infer<typeof UpdateCompanySchema> & { id: string };
