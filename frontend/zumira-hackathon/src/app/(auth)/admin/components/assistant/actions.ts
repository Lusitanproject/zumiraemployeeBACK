"use server";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { GetCompanyFeedbacks } from "./definitions";
import { cookies } from "next/headers";

export async function getCompanyFeedbacks() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/companies/feedback`;

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

  const parsed = (await response.json()) as GetCompanyFeedbacks;

  return {
    status: parsed.status,
    data: parsed.status === "SUCCESS" ? parsed.data.items : [],
    message: parsed.status === "ERROR" ? parsed.message : null,
  };
}
