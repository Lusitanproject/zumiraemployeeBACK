"use server";

import { cookies } from "next/headers";
import { catchError } from "@/utils/error";
import { decrypt } from "@/app/_lib/session";
import { GenerateResponseResponse, GetActConversationResponse } from "./definitions";

export async function getActConversation(conversationId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/conversations?actConversationId=${conversationId}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    throw new Error("Couldn't get act conversation");
  }

  const parsed = (await response.json()) as GetActConversationResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}

export async function generateResponse(body: { actConversationId: string; content: string }) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/message`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    throw new Error("Couldn't generate response");
  }

  const parsed = (await response.json()) as GenerateResponseResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}
