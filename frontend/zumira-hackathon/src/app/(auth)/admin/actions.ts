"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decrypt } from "@/app/_lib/session";

export async function verifyUserRole(): Promise<void> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  if (session?.role !== "admin") {
    redirect("/chat/novo");
  }
}
