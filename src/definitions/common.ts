import { z } from "zod";

export const RequestParamsIdUUID = z.object({
  id: z.string().uuid(),
});

export const RequestParamsIdCUID = z.object({
  id: z.string().cuid(),
});

export const PhoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .transform((val) => val.replace(/\D/g, ""))
  .refine(
    (val) => /^\d{2}9\d{8}$/.test(val),
    "Invalid phone number. Must be a Brazilian mobile number with 11 digits (area code + 9 + 8 digits). Example: 11987654321",
  );
