"use server";

import { cookies } from "next/headers";
import { Dimension } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

type GetDimensions = {
  status: "SUCCESS";
  data: {
    dimensions: Dimension[];
  };
};

export async function getDimensions(): Promise<Dimension[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/dimensions`;

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

  const parsed = (await response.json()) as GetDimensions;

  return parsed.data.dimensions;
}
