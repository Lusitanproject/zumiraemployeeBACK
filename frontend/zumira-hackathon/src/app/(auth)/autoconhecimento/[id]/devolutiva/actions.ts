"use server";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { cookies } from "next/headers";
import { GetFeedback } from "./definitions";

export async function getFeedback(selfMonitoringBlockId: string): Promise<GetFeedback> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/self-monitoring/feedback/${selfMonitoringBlockId}`;
  const [error, response] = await catchError(
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return { status: "ERROR", message: error.message };
  }

  if (!response.ok) {
    return { status: "ERROR", message: response.statusText };
  }

  const parsed = (await response.json()) as GetFeedback;

  return parsed;
}
