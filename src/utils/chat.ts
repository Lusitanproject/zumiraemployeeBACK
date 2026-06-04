import { PublicError } from "../error";
import { ChatMessage } from "../schemas/common";

export function assertHistoryEndsWithAssistant(messages: ChatMessage[]): void {
  if (messages.length > 0 && messages[messages.length - 1].role !== "assistant") {
    throw new PublicError("O histórico deve terminar com uma mensagem do assistente");
  }
}

export function buildFullMessages(messages: ChatMessage[], content: string): ChatMessage[] {
  assertHistoryEndsWithAssistant(messages);
  return [...messages, { role: "user" as const, content }];
}
