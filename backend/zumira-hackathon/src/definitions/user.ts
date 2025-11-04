import { UserGender } from "@prisma/client";
import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  birthdate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  nationalityId: z.string().cuid().optional(),
  gender: z.nativeEnum(UserGender).optional(),
  occupation: z.string().nonempty().optional(),
});

export const AuthUserSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6).optional(),
  password: z.string().optional(),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type AuthUserRequest = z.infer<typeof AuthUserSchema>;
