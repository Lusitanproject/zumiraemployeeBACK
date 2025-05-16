"use server";

import { cookies } from "next/headers";
import { Assessment, GetAssessmentsSuccess, GetSelfMonitoringBlocks, SelfMonitoringBlock } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

export async function getAssessments(): Promise<Assessment[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/assessments`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    }),
  );

  if (error) {
    return [];
  }

  const parsed = (await response.json()) as GetAssessmentsSuccess;

  return parsed.data.assessments;
}

export async function getSelfMonitoringBlocks(): Promise<SelfMonitoringBlock[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  if (!session) {
    return [];
  }

  const response = await fetch(`${process.env.API_BASE_URL}/self-monitoring`, {
    headers: {
      "Content-Type": "Application/json",
      Authorization: `Bearer ${session.token}`,
    },
  });

  const parsed = (await response.json()) as GetSelfMonitoringBlocks;

  return parsed.data.blocks;
}
