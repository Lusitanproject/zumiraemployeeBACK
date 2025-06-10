"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { Assessment, Company, Filters, GetAssessments, GetCompanies, GetResults } from "./definitions";

export async function getFilteredResults(filters: Filters) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const params = new URLSearchParams();

  for (const key in filters) {
    const value = filters[key as keyof typeof filters];
    if (value?.length) {
      params.append(key, String(value));
    }
  }

  const queryString = params.toString();
  const url = `${process.env.API_BASE_URL}/assessments/results/admin${queryString ? `?${queryString}` : ""}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return [];
  }

  if (!response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetResults;

  if (parsed.status === "ERROR") return [];

  return parsed.data.items;
}

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
    })
  );

  if (error) {
    return [];
  }

  if (!response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetCompanies;

  if (parsed.status === "ERROR") return [];

  return parsed.data.companies;
}

export async function getAssessments(): Promise<Assessment[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/assessments`, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    return [];
  }

  const parsed = (await response.json()) as GetAssessments;

  if (parsed.status === "ERROR") return [];

  return parsed.data.assessments;
}
