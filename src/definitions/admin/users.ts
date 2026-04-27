import { z } from "zod";
import { PhoneNumberSchema } from "../common";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  roleId: z.string().uuid(),
  companyId: z.string().cuid().optional(),
  customId: z.string().min(1).optional(),
  occupation: z.string().optional(),
  occupationLevel: z.string().min(1).optional(),
  area: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  skinColor: z.string().min(1).optional(),
  hasDisability: z.boolean().optional(),
  admissionDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  phoneNumber: PhoneNumberSchema.optional(),
});

export const CreateManyUsersSchema = z.array(CreateUserSchema).min(1);

export const FindByEmailSchema = z.object({
  email: z.string().email(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  roleId: z.string().uuid().optional(),
  companyId: z.string().cuid().optional(),
  customId: z.string().min(1).optional(),
  occupation: z.string().optional(),
  occupationLevel: z.string().min(1).optional(),
  area: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  skinColor: z.string().min(1).optional(),
  hasDisability: z.boolean().optional(),
  admissionDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  phoneNumber: PhoneNumberSchema.optional(),
});

export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const FindUserBySchema = z
  .object({
    id: z.string().uuid().optional(),
    email: z.string().email().optional(),
    customId: z.string().min(1).optional(),
    phoneNumber: PhoneNumberSchema.optional(),
  })
  .refine(
    (data) => Object.values(data).filter(Boolean).length > 0, // Verifica se ha ao menos um valor presente no objeto
    "At least one of the fields (id, email, customId or phoneNumber) must be provided",
  );
export type FindUserByRequest = z.infer<typeof FindUserBySchema>;
