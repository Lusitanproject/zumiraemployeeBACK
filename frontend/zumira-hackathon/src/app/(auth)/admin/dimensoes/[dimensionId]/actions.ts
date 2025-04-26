"use server";

import { cookies } from "next/headers";
import { Dimension, MonitoringBlock, GetDimensionResponse, GetMonitoringResponse } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

export async function getDimensionData(dimensionId: string | null): Promise<Dimension | null> {
  if (dimensionId === null) {
    return null;
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/dimensions/${dimensionId}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    }),
  );

  if (error) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const parsed = (await response.json()) as GetDimensionResponse;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}

export async function getMonitoringBlocks(): Promise<MonitoringBlock[]> {
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
    return [];
  }

  if (!response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetMonitoringResponse;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.blocks;
}
