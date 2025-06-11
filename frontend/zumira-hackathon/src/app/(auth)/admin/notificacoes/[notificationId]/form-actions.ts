"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

export type Payload = {
  id: string | undefined;
  title: string;
  summary: string;
  content?: string | null;
  actionUrl?: string | null;
  notificationTypeId: string;
};

export async function saveNotification(data: Payload, userIds: string[]) {
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

  redirect("/admin/notificacoes");
}
