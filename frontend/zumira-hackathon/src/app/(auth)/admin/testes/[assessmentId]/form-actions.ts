"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { redirect } from "next/navigation";
import { CreateAssessmentResponse } from "./definitions";

export type Payload = {
  id?: string | undefined;
  title: string;
  summary: string;
  description: string | null;
  selfMonitoringBlockId: string;
  operationType: "SUM" | "AVERAGE";
  openaiAssistantId?: string;
};

export async function saveAssessment(data: Payload) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments${!data.id ? "" : `/${data.id}`}`;
  const method = !data.id ? "POST" : "PUT";

  const [error, response] = await catchError(
    fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return error?.message;
  }

  if (!response.ok) {
    return response.statusText;
  }

  const result = (await response.json()) as CreateAssessmentResponse;

  if (result.status === "ERROR") {
    return result.message;
  }

  if (method === "POST") {
    redirect(`/admin/testes/${result.data.id}/perguntas`);
  }
}
