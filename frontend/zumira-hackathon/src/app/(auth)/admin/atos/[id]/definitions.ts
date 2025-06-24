import { z } from "zod";

export const ManageActChatbotSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  messageInstructions: z.string().nonempty().optional(),
  compilationInstructions: z.string().nonempty().optional(),
  icon: z.string().nonempty(),
});

export type ManageActChatbot = z.infer<typeof ManageActChatbotSchema>;

export const INITIAL_VALUE: ManageActChatbot = {
  name: "",
  description: "",
  messageInstructions: "",
  compilationInstructions: "",
  icon: "",
};

export type FormErrors = {
  name?: string[];
  description?: string[];
  messageInstructions?: string[];
  compilationInstructions?: string[];
  icon?: string[];
} | null;
