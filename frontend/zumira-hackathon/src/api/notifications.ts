"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { Notification, NotificationType } from "@/types/notification";
import { catchError } from "@/utils/error";

import { ZumiraApiResponse } from "./common";

export type SaveNotificationTypeRequest = {
  id: string | undefined;
  name: string;
  color: string;
  priority: number;
};
export type SaveNotificationRequest = {
  id: string | undefined;
  title: string;
  summary: string;
  content?: string | null;
  actionUrl?: string | null;
  notificationTypeId: string;
};
export type GetNotificationsRequest = { filter: "unread" | "recent"; max?: number };

export type GetNotificationsResponse = ZumiraApiResponse<{ notifications: Notification[] }>;
export type DetailNotificationResponse = ZumiraApiResponse<Notification>;
export type GetNotificationTypesResponse = ZumiraApiResponse<{ items: NotificationType[] }>;
export type GetNotificationTypeResponse = ZumiraApiResponse<NotificationType>;

export async function getNotifications({ filter, max }: GetNotificationsRequest) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/notifications?filter=${filter}${max ? `&max=${max}` : ""}`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetNotificationsResponse;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.notifications;
}

export async function readNotification(notificationId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  fetch(`${process.env.API_BASE_URL}/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${session?.token}`,
    },
  });
}

export async function detailNotification(notificationId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/notifications/${notificationId}`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    return null;
  }

  const parsed = (await response.json()) as DetailNotificationResponse;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}

export async function getNotificationTypes() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/notifications/admin/types`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetNotificationTypesResponse;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.items;
}

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

  const parsed = (await response.json()) as GetNotificationTypeResponse;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}

export async function saveNotificationType(data: SaveNotificationTypeRequest) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/notifications/admin/types${!data.id ? "" : `/${data.id}`}`;
  const method = !data.id ? "POST" : "PUT";

  const [error, response] = await catchError(
    fetch(url, {
      method,
      body: JSON.stringify({ ...data, userIds: [] }),
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return error?.message;
  }

  if (!response.ok) {
    return response.statusText;
  }
}

export async function saveNotification(data: SaveNotificationRequest, userIds: string[]) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/notifications${!data.id ? "" : `/${data.id}`}`;
  const method = !data.id ? "POST" : "PUT";

  const [error, response] = await catchError(
    fetch(url, {
      method,
      body: JSON.stringify({ ...data, userIds }),
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return error?.message;
  }

  if (!response.ok) {
    return response.statusText;
  }
}
