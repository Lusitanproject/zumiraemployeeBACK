"use server"

import { cookies } from "next/headers";
import { Company, GetCompanyResponse } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

export async function getCompanyData(companyId: string | null): Promise<Company | null> {
  if (companyId === null) {
    return null
  }

  const cookie = await cookies()
  const session = decrypt(cookie.get("session")?.value)

  const url = `${process.env.API_BASE_URL}/companies/${companyId}`

  const [error, response] = await catchError(fetch(url, {
    headers: {
      "Content-Type": "Application/json",
      "Authorization": `Bearer ${session?.token}`
    }
  }))

  if (error) {
    return null
  }

  if (!response.ok) {
    return null
  }

  const parsed = (await response.json()) as GetCompanyResponse

  if (parsed.status === "ERROR") {
    return null
  }

  return parsed.data
}
