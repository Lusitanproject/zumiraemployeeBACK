"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { NewConversationResponse } from "./definitions";

export async function newConversation(actChatbotId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/new-conversation?actChatbotId=${actChatbotId}`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    throw new Error("Couldn't generate response");
  }

  const parsed = (await response.json()) as NewConversationResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  redirect(`/chat/${parsed.data.id}`);
}
