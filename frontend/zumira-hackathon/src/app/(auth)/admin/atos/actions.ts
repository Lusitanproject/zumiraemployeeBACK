"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { ActChatbot, GetActChatbots } from "./definitions";

export async function getActChatbots() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/admin`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) return [];

  const parsed = (await response.json()) as GetActChatbots;

  if (parsed.status === "ERROR") return [];

  return parsed.data.items;
}

export async function reorderChatbots(chatbots: ActChatbot[]) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/admin/reorder`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "PUT",
      body: JSON.stringify({ chatbots }),
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok || (await response.json()).status === "ERROR") {
    throw new Error("Could not reorder acts");
  }
}
