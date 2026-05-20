import { z } from "zod";
import { DateStringSchema, PhoneNumberSchema } from "../common";

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  roleId: z.string().uuid(),
  companyId: z.string().cuid().optional(),
  customId: z.string().min(1).optional(),
  occupation: z.string().optional(),
  occupationLevel: z.string().min(1).optional(),
  area: z.string().min(1).optional(),
  similarExposureGroup: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  skinColor: z.string().min(1).optional(),
  hasDisability: z.boolean().optional(),
  admissionDate: DateStringSchema.optional(),
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
  similarExposureGroup: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  skinColor: z.string().min(1).optional(),
  hasDisability: z.boolean().optional(),
  admissionDate: DateStringSchema.optional(),
  phoneNumber: PhoneNumberSchema.optional(),
});

export const UpdateCompanyUserSchema = UpdateUserSchema.omit({ roleId: true, companyId: true });

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

const USER_FILTER_COLUMNS = [
  "gender",
  "occupation",
  "occupationLevel",
  "area",
  "similarExposureGroup",
  "location",
  "skinColor",
  "hasDisability",
  "roleId",
  "companyId",
  "nationalityId",
] as const;

export type UserFilterColumn = (typeof USER_FILTER_COLUMNS)[number];

export const GetUserFiltersSchema = z.object({
  columns: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .pipe(z.array(z.enum(USER_FILTER_COLUMNS)).min(1)),
});

export const SearchUsersSchema = z.object({
  page:            z.coerce.number().int().min(1).default(1),
  pageSize:        z.coerce.number().int().min(1).max(100).default(10),
  search:          z.string().optional(),
  companyId:       z.string().cuid().optional(),
  roleId:          z.string().uuid().optional(),
  gender:          z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  occupation:      z.string().optional(),
  occupationLevel: z.string().optional(),
  area:                 z.string().optional(),
  similarExposureGroup: z.string().optional(),
  location:             z.string().optional(),
  skinColor:       z.string().optional(),
  hasDisability:   z.string().optional().transform((v) => (v === undefined ? undefined : v === "true")),
  nationalityId:   z.string().cuid().optional(),
});

export type SearchUsersRequest = z.infer<typeof SearchUsersSchema>;
