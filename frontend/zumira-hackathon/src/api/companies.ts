"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { CompanyFeedback } from "@/app/(auth)/admin/components/assistant/definitions";
import { Company } from "@/types/company";
import { catchError } from "@/utils/error";

import { ZumiraApiResponse } from "./common";

export type GetCompaniesResponse = ZumiraApiResponse<{ companies: Company[] }>;
export type GetCompanyFeedbackResponse = ZumiraApiResponse<CompanyFeedback>;

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

  const parsed = (await response.json()) as GetCompaniesResponse;

  if (parsed.status === "ERROR") return [];

  return parsed.data.companies;
}

export async function getCompanyFeedback(companyId: string, assessmentId: string): Promise<CompanyFeedback> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/companies/${companyId}/feedback?assessmentId=${assessmentId}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const parsed = (await response.json()) as GetCompanyFeedbackResponse;

  if (parsed.status === "ERROR") throw new Error(parsed.message);

  return parsed.data;
}
