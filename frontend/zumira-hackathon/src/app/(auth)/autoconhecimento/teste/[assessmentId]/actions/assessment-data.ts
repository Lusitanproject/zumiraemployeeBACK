"use server";

import { cookies } from "next/headers";
import { AssessmentDetail, GetAssessmentData } from "../definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { isAfter, subYears } from "date-fns";

export type AssessmentResponse =
  | { status: "AVAILABLE"; data: AssessmentDetail }
  | { status: "COMPLETED"; message: string }
  | { status: "ERROR"; message: string };

export async function getAssessmentData(assessmentId: string): Promise<AssessmentResponse> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/${assessmentId}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    }),
  );

  if (error || !response.ok) {
    return {
      status: "ERROR",
      message: "Ocorreu um erro ao tentar buscar as informações deste teste. Por favor tente mais tarde",
    };
  }

  const parsed = (await response.json()) as GetAssessmentData;

  if (
    parsed.data.lastCompleted !== null &&
    isAfter(new Date(parsed.data.lastCompleted), subYears(new Date(), 1)) &&
    !(process.env.NEXT_PUBLIC_ALLOW_REPEAT_ASSESSMENTS === "true")
  ) {
    return { status: "COMPLETED", message: "" };
  }

  return { status: "AVAILABLE", data: parsed.data };
}
