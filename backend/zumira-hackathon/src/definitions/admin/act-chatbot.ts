import { z } from "zod";

export const CreateActChatbotSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  initialMessage: z.string().optional(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  icon: z.string().nonempty(),
  trailId: z.string().cuid(),
});

export const UpdateActChatbotSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
  initialMessage: z.string().optional(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  index: z.number().int().optional(),
  icon: z.string().nonempty().optional(),
  trailId: z.string().cuid().optional(),
});

export const UpdateManyActChatbotsSchema = z.object({
  chatbots: z.array(UpdateActChatbotSchema),
});

export const FindByTrailSchema = z.object({
  trailId: z.string().cuid(),
});

export type CreateActChatbotRequest = z.infer<typeof CreateActChatbotSchema>;
export type UpdateActChatbotRequest = z.infer<typeof UpdateActChatbotSchema>;
export type UpdateManyActChatbotsRequest = z.infer<typeof UpdateManyActChatbotsSchema>;
