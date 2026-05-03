import { UserGender } from "@prisma/client";
import { z } from "zod";
import { DateStringSchema, PhoneNumberSchema } from "./common";

export const CreateUserSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  phoneNumber: PhoneNumberSchema.optional(),
  customId: z.string().nonempty().optional(),
  birthdate: DateStringSchema.optional(),
  admissionDate: DateStringSchema.optional(),
  nationalityId: z.string().cuid().optional(),
  gender: z.nativeEnum(UserGender).optional(),
  occupation: z.string().nonempty().optional(),
  occupationLevel: z.string().nonempty().optional(),
  area: z.string().nonempty().optional(),
  location: z.string().nonempty().optional(),
  skinColor: z.string().nonempty().optional(),
  hasDisability: z.boolean().optional(),
});

export const AuthUserSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6).optional(),
  password: z.string().optional(),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type AuthUserRequest = z.infer<typeof AuthUserSchema>;
