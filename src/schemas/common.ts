import { z } from "zod";

import { tryParsePhone } from "../utils/phone";

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

// Aceita qualquer formato legível (com/sem +, com/sem código de país, com formatação).
// País padrão: Brasil. Output sempre em E.164 (ex: +5511987654321).
// Ver docs/phone-number-format.md para exemplos completos.
export const PhoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .transform((val, ctx) => {
    const phone = tryParsePhone(val) ?? tryParsePhone(`+${val.replace(/\D/g, "")}`);
    if (!phone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid phone number: "${val}"` });
      return z.NEVER;
    }
    return phone.format("E.164");
  });

export const UserIdSchema = z.object({
  userId: z.string().uuid(),
});

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().nonempty(),
});

export const ChatHistorySchema = z.array(ChatMessageSchema).default([]);

export const MessageWithHistorySchema = z.object({
  content: z.string().nonempty(),
  messages: ChatHistorySchema,
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type MessageWithHistoryRequest = z.infer<typeof MessageWithHistorySchema>;
