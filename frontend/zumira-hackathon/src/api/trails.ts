"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { CompanyFeedback } from "@/app/(auth)/admin/components/assistant/definitions";
import { Company } from "@/types/company";
import { catchError } from "@/utils/error";

import { ZumiraApiResponse } from "./common";
import { Trail } from "@/types/trail";

type GetTrailsAdminResponse = ZumiraApiResponse<{ items: Trail[] }>;
type GetTrailDataResponse = ZumiraApiResponse<Trail>;

export async function getTrailsAdmin(): Promise<Trail[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/trails/admin`;

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

  const parsed = (await response.json()) as GetTrailsAdminResponse;

  if (parsed.status === "ERROR") return [];

  return parsed.data.items;
}

export async function getTrailData(id: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/trails/admin/${id}`;

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

  const parsed = (await response.json()) as GetTrailDataResponse;

  if (parsed.status === "ERROR") return null;

  return parsed.data;
}
