"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { Assessment, GetAssessmentsError, GetAssessmentsSuccess } from "./definitions";

export async function getAssessments(): Promise<Assessment[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/assessments/admin`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetAssessmentsSuccess | GetAssessmentsError;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.assessments;
}
