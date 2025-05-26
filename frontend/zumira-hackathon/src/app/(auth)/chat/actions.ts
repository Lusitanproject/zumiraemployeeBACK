"use server";

import { cookies } from "next/headers";
import { catchError } from "@/utils/error";
import { decrypt } from "@/app/_lib/session";
import { GetResults } from "./definitions";

export async function getResults() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/results`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return { status: "ERROR", data: [], message: error.message };
  }

  if (!response.ok) {
    return { status: "ERROR", data: [], message: response.statusText };
  }

  const parsed = (await response.json()) as GetResults;

  return {
    status: parsed.status,
    data: parsed.status === "SUCCESS" ? parsed.data.items : [],
    message: parsed.status === "ERROR" ? parsed.message : null,
  };
}
