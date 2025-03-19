import { z } from "zod"

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  roleId: z.string().uuid(),
  companyId: z.string().uuid().optional()
})

export const FindByEmailSchema = z.object({
  email: z.string().email()
})

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  roleId: z.string().uuid().optional(),
  companyId: z.string().cuid().optional()
})

export const CreateCompanySchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})