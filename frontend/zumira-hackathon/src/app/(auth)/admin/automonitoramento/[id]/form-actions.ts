"use server"

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { redirect } from "next/navigation";

export type Payload = {
  id: string | undefined
  title: string
  icon?: string
  summary?: string
}

export async function saveSelfMonitoringBlock(data: Payload) {
  const cookie = await cookies()
  const session = decrypt(cookie.get("session")?.value)

  const url = `${process.env.API_BASE_URL}/self-monitoring/admin${!data.id ? "" : `/${data.id}`}`
  const method = !data.id ? "POST" : "PUT"

  const [error, response] = await catchError(fetch(url, {
    method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/json",
      "Authorization": `Bearer ${session?.token}`
    }
  }))

  if (error) {
    return error?.message
  }

  if(!response.ok) {
    return response.statusText
  }

  redirect("/admin/automonitoramento")
}
