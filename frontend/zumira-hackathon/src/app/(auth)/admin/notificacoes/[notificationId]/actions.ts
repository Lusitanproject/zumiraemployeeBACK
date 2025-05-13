"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { Notification } from "../definitions";
import { GetNotificationResponse, GetNotificationTypesResponse, NotificationType } from "./definitions";

export async function getNotificationData(notificationId: string | null): Promise<Notification | null> {
  if (notificationId === null) {
    return null;
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/notifications/${notificationId}`;

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

  const parsed = (await response.json()) as GetNotificationResponse;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}

export async function getNotificationTypes(): Promise<NotificationType[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/notifications/admin/types`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return [];
  }

  if (!response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetNotificationTypesResponse;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.items;
}
