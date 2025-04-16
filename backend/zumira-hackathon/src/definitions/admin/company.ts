import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const FindCompanySchema = z.object({
  id: z.string().cuid(),
});
