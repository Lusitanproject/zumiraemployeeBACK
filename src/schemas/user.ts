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
  similarExposureGroup: z.string().nonempty().optional(),
  location: z.string().nonempty().optional(),
  skinColor: z.string().nonempty().optional(),
  hasDisability: z.boolean().optional(),
});

export const UpdateMeSchema = z.object({
  name: z.string().nonempty().optional(),
  phoneNumber: PhoneNumberSchema.optional(),
  birthdate: DateStringSchema.optional(),
  nationalityId: z.string().cuid().optional(),
  gender: z.nativeEnum(UserGender).optional(),
  occupation: z.string().nonempty().optional(),
  occupationLevel: z.string().nonempty().optional(),
  area: z.string().nonempty().optional(),
  similarExposureGroup: z.string().nonempty().optional(),
  location: z.string().nonempty().optional(),
  skinColor: z.string().nonempty().optional(),
  hasDisability: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

export type UpdateMeRequest = z.infer<typeof UpdateMeSchema>;

export const AuthUserSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6).optional(),
  password: z.string().optional(),
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type AuthUserRequest = z.infer<typeof AuthUserSchema>;

export const SyncUserItemSchema = z.object({
  customId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8).optional(),
  phoneNumber: z.string().optional(),
  occupation: z.string().optional(),
  occupationLevel: z.string().optional(),
  area: z.string().optional(),
  similarExposureGroup: z.string().optional(),
  location: z.string().optional(),
  skinColor: z.string().optional(),
  hasDisability: z.boolean().optional(),
  birthdate: DateStringSchema.optional(),
  admissionDate: DateStringSchema.optional(),
  gender: z.nativeEnum(UserGender).optional(),
  nationalityId: z.string().cuid().optional(),
});

export const SyncUsersPayloadSchema = z.object({
  users: z.array(SyncUserItemSchema).min(1),
});

export const SyncCompanyParamsSchema = z.object({
  id: z.string().cuid(),
});

export type SyncUserItem = z.infer<typeof SyncUserItemSchema>;
