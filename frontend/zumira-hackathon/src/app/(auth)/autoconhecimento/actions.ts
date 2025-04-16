"use server";

import { cookies } from "next/headers";
import { GetSelfMonitoringBlocks, MonitoringBlock } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

type GetMonitoringBlocks = {
  status: "SUCCESS" | "ERROR";
  data: MonitoringBlock[];
  message: string | null;
};

export async function getMonitoringBlocks(): Promise<GetMonitoringBlocks> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/self-monitoring`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    }),
  );

  if (error) {
    return { status: "ERROR", data: [], message: error.message };
  }

  if (!response.ok) {
    return { status: "ERROR", data: [], message: response.statusText };
  }

  const parsed = (await response.json()) as GetSelfMonitoringBlocks;

  return {
    status: parsed.status,
    data: parsed.status === "SUCCESS" ? parsed.data.blocks : [],
    message: parsed.status === "ERROR" ? parsed.message : null,
  };
}
