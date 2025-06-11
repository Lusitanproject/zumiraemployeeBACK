"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { ActChatbot } from "../definitions";
import { GetActChatbot } from "./definitions";

export async function loadActChatbot(id: string | null): Promise<ActChatbot | null> {
  if (id === null) {
    return null;
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/admin/${id}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const parsed = (await response.json()) as GetActChatbot;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}
