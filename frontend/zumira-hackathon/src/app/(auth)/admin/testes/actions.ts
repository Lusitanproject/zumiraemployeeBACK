"use server"

import { cookies } from "next/headers";
import { Assessment, GetAssessmentsError, GetAssessmentsSuccess } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

export async function getAssessments(): Promise<Assessment[]> {
  const cookie = await cookies()
  const session = decrypt(cookie.get("session")?.value)

  const [error, response] = await catchError(fetch(`${process.env.API_BASE_URL}/assessments`, {
    headers: {
      "Content-Type": "Application/json",
      "Authorization": `Bearer ${session?.token}`
    }
  }))

  if(error  || !response.ok) {
    return []
  }

  const parsed = (await response.json()) as GetAssessmentsSuccess | GetAssessmentsError

  if(parsed.status === "ERROR"){
    return []
  }

  return parsed.data.assessments
}
