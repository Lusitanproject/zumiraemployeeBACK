"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { GetNationalityResponse, Nationality } from "./definitions";

export async function getNationalityData(nationalityId: string | null): Promise<Nationality | null> {
  if (nationalityId === null) {
    return null;
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/nationalities/admin/${nationalityId}`;

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

  const parsed = (await response.json()) as GetNationalityResponse;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}
