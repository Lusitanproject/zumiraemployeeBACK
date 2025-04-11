"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { AssessmentResponse, AssessmentSummary } from "./definitions";

export async function getAssessmentData(assessmentId: string | null): Promise<AssessmentSummary | null> {
  if (assessmentId === null) {
    return null;
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/admin/${assessmentId}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    return null;
  }

  const parsed = (await response.json()) as AssessmentResponse;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}
