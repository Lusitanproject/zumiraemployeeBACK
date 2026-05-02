import { z } from "zod";

const DDMMYYYY_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

const parseDdMmYyyyDate = (value: string): Date | null => {
  const match = value.match(DDMMYYYY_REGEX);
  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null;
  }

  return parsed;
};

export const parseSupportedDate = (value: string): Date | null => {
  const trimmedValue = value.trim();
  const ddMmYyyyDate = parseDdMmYyyyDate(trimmedValue);

  if (ddMmYyyyDate) {
    return ddMmYyyyDate;
  }

  const defaultParsedDate = new Date(trimmedValue);
  if (Number.isNaN(defaultParsedDate.getTime())) {
    return null;
  }

  return defaultParsedDate;
};

export const DateStringSchema = z.string().transform((value, context) => {
  const parsedDate = parseSupportedDate(value);
  if (!parsedDate) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid date: "${value}". Use a standard date format or DD/MM/YYYY`,
    });
    return z.NEVER;
  }

  return parsedDate;
});

export const RequestParamsIdUUID = z.object({
  id: z.string().uuid(),
});

export const RequestParamsIdCUID = z.object({
  id: z.string().cuid(),
});

export let PhoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .transform((val) => ({
    original: val,
    digits: val.replace(/\D/g, ""),
  }))
  .refine(
    ({ digits }) => /^(?:\d{2}(?:9\d{8}|\d{8})|\d{2}\d{10})$/.test(digits),
    ({ original }) => ({
      message: `Invalid phone number: "${original}". Must be a Brazilian phone number in one of these formats: 1143547228, 11987654321, or prefixed format like 16-1140722298`,
    }),
  )
  .transform(({ digits }) => digits);

export const UserIdSchema = z.object({
  userId: z.string().uuid(),
});
