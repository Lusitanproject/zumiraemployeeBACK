"use server";

import { cookies } from "next/headers";
import { Company } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

type GetCompanies = {
  status: "SUCCESS";
  data: {
    companies: Company[];
  };
};

export async function getCompanies(): Promise<Company[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/companies`;

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

  const parsed = (await response.json()) as GetCompanies;

  return parsed.data.companies;
}
