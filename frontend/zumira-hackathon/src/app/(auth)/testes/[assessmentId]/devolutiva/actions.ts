"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { GetResults } from "./definitions";

export async function getResult(assessmentId: string): Promise<GetResults> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/results/${assessmentId}`;
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

  const parsed = (await response.json()) as GetResults;

  return parsed;
}
