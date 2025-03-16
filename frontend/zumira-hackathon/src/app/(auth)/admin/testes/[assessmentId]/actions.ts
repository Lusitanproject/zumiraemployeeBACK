"use server"

import { cookies } from "next/headers";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { Assessment, AssessmentResponse } from "./definitions";

export async function getAssessmentData(assessmentId: string | null): Promise<Assessment | null> {
  if (assessmentId === null) {
    return null
  }

  const cookie = await cookies()
  const session = decrypt(cookie.get("session")?.value)

  const url = `${process.env.API_BASE_URL}/assessments/${assessmentId}`

  const [error, response] = await catchError(fetch(url, {
    headers: {
      "Authorization": `Bearer ${session?.token}`
    }
  }))

  if (error || !response.ok) {
    return null
  }

  const parsed = (await response.json()) as AssessmentResponse

  if (parsed.status === "SUCCESS") {
    return parsed.data
  }

  return null
}
