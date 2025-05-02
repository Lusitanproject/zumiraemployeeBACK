import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { cookies } from "next/headers";
import { GetNotificationsError, GetNotificationsSuccess } from "./definitions";

export async function getNotifications() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/notifications?filter=unread`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  console.log(response, error);

  if (error || !response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetNotificationsSuccess | GetNotificationsError;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.notifications;
}
