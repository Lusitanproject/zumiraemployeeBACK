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

export type CreateActChapterRequest = z.infer<typeof CreateActChapterSchema> & { userId: string; type: ChapterType };

export type CompileActChapterRequest = z.infer<typeof CompileActChapterSchema> & { userId: string };

export type UpdateActChapterRequest = z.infer<typeof UpdateActChapterSchema> & { userId: string };

export const CreateActSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  icon: z.string().nonempty(),
  published: z.boolean().optional(),
  initialMessage: z.string().optional(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  reportInstructions: z.string().optional(),
  consultiveAiInstructions: z.string().optional(),
  bioanalysisInstructions: z.string().optional(),
});

export const UpdateActSchema = z.object({
  name: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
  icon: z.string().nonempty().optional(),
  published: z.boolean().optional(),
  initialMessage: z.string().optional(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  reportInstructions: z.string().optional(),
  consultiveAiInstructions: z.string().optional(),
  bioanalysisInstructions: z.string().optional(),
});

export type CreateActRequest = z.infer<typeof CreateActSchema>;
export type UpdateActRequest = z.infer<typeof UpdateActSchema>;

export const ActAnalysisMessageSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export type ActAnalysisMessageRequest = z.infer<typeof ActAnalysisMessageSchema>;
