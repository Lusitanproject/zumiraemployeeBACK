import { z } from "zod";

export const CreateActChatbotSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  initialMessage: z.string().optional(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  reportGenerationInstructions: z.string().optional(),
  reportLookupInstructions: z.string().optional(),
  icon: z.string().nonempty(),
});

export const UpdateActChatbotSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nonempty().optional(),
  description: z.string().nonempty().optional(),
  initialMessage: z.string().optional(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  reportGenerationInstructions: z.string().optional(),
  reportLookupInstructions: z.string().optional(),
  icon: z.string().nonempty().optional(),
});

export const UpdateManyActChatbotsSchema = z.object({
  chatbots: z.array(UpdateActChatbotSchema),
});

export const FindByTrailSchema = z.object({
  trailId: z.string().cuid(),
});

export type FindByTrailRequest = z.infer<typeof FindByTrailSchema>;

export const FindByCompanySchema = z.object({
  companyId: z.string().cuid(),
});

export const ImportChatbaseChaptersSchema = z.object({
  chatbaseChatbotId: z.string().nonempty(),
});

export const TestMessageActChatbotSchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().nonempty() })).min(1),
});

export type CreateActChatbotRequest = z.infer<typeof CreateActChatbotSchema>;
export type UpdateActChatbotRequest = z.infer<typeof UpdateActChatbotSchema>;
export type UpdateManyActChatbotsRequest = z.infer<typeof UpdateManyActChatbotsSchema>;
export type ImportChatbaseChaptersRequest = z.infer<typeof ImportChatbaseChaptersSchema>;
export type TestMessageActChatbotRequest = z.infer<typeof TestMessageActChatbotSchema>;
