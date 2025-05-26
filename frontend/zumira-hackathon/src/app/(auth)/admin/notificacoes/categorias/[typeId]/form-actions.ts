"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { redirect } from "next/navigation";

export type Payload = {
  id: string | undefined;
  name: string;
  color: string;
  priority: number;
};

export async function saveNotificationType(data: Payload) {
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

  redirect("/admin/notificacoes");
}
