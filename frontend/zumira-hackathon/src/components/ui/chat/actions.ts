"use server";

import { catchError } from "@/utils/error";
import { ChatMessage, ChatResponse } from "./definitions";

export async function messageChatbot(
  chatbotId: string,
  username: string,
  messages: ChatMessage[],
  newMessage: ChatMessage,
  context: ChatMessage[] = []
): Promise<ChatResponse | null> {
  const body = {
    messages: [{ content: `Meu nome é ${username}`, role: "user" }, ...messages, ...context, newMessage],
    chatbotId,
  };

  const [error, response] = await catchError(
    fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHATBASE_SECRET_KEY}`,
      },
      body: JSON.stringify(body),
    })
  );

  if (error) {
    return null;
  }

  const parsed = (await response.json()) as ChatResponse;

  return parsed;
}
