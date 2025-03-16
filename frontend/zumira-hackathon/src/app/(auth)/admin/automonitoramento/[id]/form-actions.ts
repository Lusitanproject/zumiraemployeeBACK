"use server"

// import { cookies } from "next/headers";

// import { decrypt } from "@/app/_lib/session";
// import { catchError } from "@/utils/error";

export type Payload = {
  id: string | undefined
  icon: string
  title: string
  summary: string
}

export async function saveSelfMonitoringBlock() {
  // const cookie = await cookies()
  // const session = decrypt(cookie.get("session")?.value)

  // const url = `${process.env.API_BASE_URL}/self-monitoring${!data.id ? "" : `/${data.id}`}`
  // const method = !data.id ? "POST" : "PUT"

  // const [error, response] = await catchError(fetch(url, {
  //   method,
  //   body: JSON.stringify(data),
  //   headers: {
  //     "Content-Type": "Application/json",
  //     "Authorization": `Bearer ${session?.token}`
  //   }
  // }))

}
