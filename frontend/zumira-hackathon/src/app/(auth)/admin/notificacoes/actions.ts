"use server";

import { cookies } from "next/headers";
import { Notification, GetNotificationsError, GetNotificationsSuccess } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

export async function getNotifications(): Promise<Notification[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/notifications/admin`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetNotificationsSuccess | GetNotificationsError;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.notifications;
}
