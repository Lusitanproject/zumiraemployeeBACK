import { z } from "zod";

export const GetActConversationSchema = z.object({
  actConversationId: z.string().cuid(),
});

export const MessageActChatbotSchema = z.object({
  actConversationId: z.string().cuid(),
  content: z.string().nonempty(),
});

export const CreateActConversationSchema = z.object({
  actChatbotId: z.string().cuid(),
});

export type GetActConversationRequest = z.infer<typeof GetActConversationSchema> & { userId: string };

export type MessageActChatbotRequest = z.infer<typeof MessageActChatbotSchema> & { userId: string };

export type CreateActConversationRequest = z.infer<typeof CreateActConversationSchema> & { userId: string };
