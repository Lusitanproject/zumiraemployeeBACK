"use server";

import { redirect } from "next/navigation";

import { saveNotificationType as saveNotificationTypeApi, SaveNotificationTypeRequest } from "@/api/notifications";

export async function saveNotificationType(payload: SaveNotificationTypeRequest) {
  const response = await saveNotificationTypeApi(payload);
  if (response) return response;
  redirect("/admin/notificacoes");
}
