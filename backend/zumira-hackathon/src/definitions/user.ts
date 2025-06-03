import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  birthdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
  nationalityId: z.string().cuid(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"] as const).optional(),
  occupation: z.string().nonempty().optional(),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
