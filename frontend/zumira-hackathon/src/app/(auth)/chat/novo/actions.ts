"use server";

import { redirect } from "next/navigation";

import { newActChapter } from "@/api/acts";

export async function newChapter(actChatbotId: string) {
  const response = await newActChapter(actChatbotId, "REGULAR");
  redirect(`/chat/${response.id}`);
}
