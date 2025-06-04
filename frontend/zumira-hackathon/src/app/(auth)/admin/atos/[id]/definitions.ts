import { z } from "zod";
import { ActChatbot } from "../definitions";

export const ManageActChatbotSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  instructions: z.string().nonempty(),
  icon: z.string().nonempty(),
});

export type ManageActChatbot = z.infer<typeof ManageActChatbotSchema>;

export const INITIAL_VALUE: ManageActChatbot = {
  name: "",
  description: "",
  instructions: "",
  icon: "",
};

export type FormErrors = {
  name?: string[];
  description?: string[];
  instructions?: string[];
  icon?: string[];
} | null;

export type GetActChatbot =
  | {
      status: "SUCCESS";
      data: ActChatbot;
    }
  | {
      status: "ERROR";
      message: string;
    };
