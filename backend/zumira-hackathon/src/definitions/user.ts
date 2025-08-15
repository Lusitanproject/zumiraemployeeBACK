import { UserGender } from "@prisma/client";
import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  birthdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  nationalityId: z.string().cuid().optional(),
  gender: z.nativeEnum(UserGender).optional(),
  occupation: z.string().nonempty().optional(),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
