"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { Alert } from "@/types/alert";
import { catchError } from "@/utils/error";

import { ZumiraApiResponse } from "./common";

export type GetAlertsRequest = { filter: "read" | "recent"; max?: number };

export type GetAlertsResponse = ZumiraApiResponse<{ items: Alert[] }>;

export async function getAlerts({ filter, max }: GetAlertsRequest) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/assessments/alerts?filter=${filter}${max ? `&max=${max}` : ""}`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetAlertsResponse;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.items;
}

export async function readAlert(alertId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  await fetch(`${process.env.API_BASE_URL}/assessments/alerts/${alertId}/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${session?.token}`,
    },
  });
}
