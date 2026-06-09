import { ChapterType } from "@prisma/client";
import { z } from "zod";

import { MessageWithHistorySchema } from "./common";

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
  reportGenerationInstructions: z.string().optional(),
  reportLookupInstructions: z.string().optional(),
  individualAnalysisInstructions: z.string().optional(),
});

export const UpdateActSchema = z.object({
  name: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
  icon: z.string().nonempty().optional(),
  published: z.boolean().optional(),
  initialMessage: z.string().optional(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  reportGenerationInstructions: z.string().optional(),
  reportLookupInstructions: z.string().optional(),
  individualAnalysisInstructions: z.string().optional(),
});

export const TestActSchema = MessageWithHistorySchema.extend({
  instructions: z.string().optional(),
});

export type CreateActRequest = z.infer<typeof CreateActSchema>;
export type UpdateActRequest = z.infer<typeof UpdateActSchema>;
export type TestActRequest = z.infer<typeof TestActSchema>;

export const ActAnalysisMessageSchema = MessageWithHistorySchema;

export type ActAnalysisMessageRequest = z.infer<typeof ActAnalysisMessageSchema>;
