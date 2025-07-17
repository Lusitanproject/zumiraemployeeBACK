"use server";

import { redirect } from "next/navigation";

import { saveNotification as saveNotificationApi, SaveNotificationRequest } from "@/api/notifications";

export async function saveNotification(data: SaveNotificationRequest, userIds: string[]) {
  const response = await saveNotificationApi(data, userIds);
  if (response) return response;

  redirect("/admin/notificacoes");
}
