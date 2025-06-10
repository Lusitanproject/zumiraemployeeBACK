"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { decrypt } from "@/app/_lib/session";

export async function generateFeedback(assessmentId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  fetch(`${process.env.API_BASE_URL}/assessments/feedback/companies/${assessmentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
  });

  await fetch(`${process.env.API_BASE_URL}/assessments/feedback/users/${assessmentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.token}`,
    },
  });

  redirect(`/autoconhecimento/teste/${assessmentId}/devolutiva`, RedirectType.replace);
}
