"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { AssessmentResponse, AssessmentSummary, CreateAssessmentResponse } from "./definitions";

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

export async function duplicateAssessment(assessmentId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/admin/duplicate/${assessmentId}`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    throw new Error("Could not duplicate assessment");
  }

  const parsed = (await response.json()) as CreateAssessmentResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  redirect(`/admin/testes/${parsed.data.id}`);
}
