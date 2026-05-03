import { ChapterType } from "@prisma/client";
import { z } from "zod";

export const GetActChapterSchema = z.object({
  actChapterId: z.string().cuid(),
});

export const MessageActChatbotSchema = z.object({
  actChapterId: z.string().cuid(),
  content: z.string().nonempty(),
});

export const CreateActChapterSchema = z.object({
  actChatbotId: z.string().cuid(),
  type: z.nativeEnum(ChapterType),
});

export const CompileActChapterSchema = z.object({
  actChapterId: z.string().cuid(),
});

export const UpdateActChapterSchema = z.object({
  actChapterId: z.string().cuid(),
  title: z.string().nonempty().optional(),
  compilation: z.string().nullable().optional(),
});

export type GetActChapterRequest = z.infer<typeof GetActChapterSchema> & { userId: string };

export type MessageActChatbotRequest = z.infer<typeof MessageActChatbotSchema> & { userId: string };

export type CreateActChapterRequest = z.infer<typeof CreateActChapterSchema> & { userId: string };

export type CompileActChapterRequest = z.infer<typeof CompileActChapterSchema> & { userId: string };

export type UpdateActChapterRequest = z.infer<typeof UpdateActChapterSchema> & { userId: string };
