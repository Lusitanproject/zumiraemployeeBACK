"use server";

import { redirect } from "next/navigation";

import { newActConversation } from "@/api/acts";

export async function newConversation(actChatbotId: string) {
  const response = await newActConversation(actChatbotId, "REGULAR");
  redirect(`/chat/${response.id}`);
}
