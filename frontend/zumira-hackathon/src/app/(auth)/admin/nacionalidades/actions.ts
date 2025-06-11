"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { Nationality } from "@/types/nationality";
import { catchError } from "@/utils/error";

import { GetNationalitiesResponse } from "./definitions";

export async function getNationalities(): Promise<Nationality[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/nationalities/admin`;

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

  const parsed = (await response.json()) as GetNationalitiesResponse;

  return parsed.data.items;
}
