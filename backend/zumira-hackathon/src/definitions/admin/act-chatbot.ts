import { z } from "zod";

export const CreateActChatbotSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  icon: z.string().nonempty(),
});

export const UpdateActChatbotSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  icon: z.string().nonempty(),
});

export const ReorderActChatbotsSchema = z.object({
  chatbots: z.array(
    z.object({
      id: z.string().cuid(),
      nextActChatbotId: z.string().cuid().nullable(),
    })
  ),
});

export type CreateActChatbotRequest = z.infer<typeof CreateActChatbotSchema>;
export type UpdateActChatbotRequest = z.infer<typeof UpdateActChatbotSchema>;
export type ReorderActChatbotsRequest = z.infer<typeof ReorderActChatbotsSchema>;
