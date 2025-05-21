"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { GetNotificationType } from "./definitions";

export async function getNotificationType(notificationTypeId: string | null) {
  if (notificationTypeId === null) {
    return null;
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/notifications/admin/types/${notificationTypeId}`;

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

  const parsed = (await response.json()) as GetNotificationType;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}
