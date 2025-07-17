"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { Assessment, AssessmentResult } from "@/types/assessment";
import { catchError } from "@/utils/error";

import { ZumiraApiResponse } from "./common";

export interface DownloadAssessmentResultsReportRequest {
  assessmentId: string;
  companyId?: string;
}
export interface GetAssessmentResultsFilteredRequest {
  assessmentId: string;
  companyId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export type GetAssessmentsResponse = ZumiraApiResponse<{ assessments: Assessment[] }>;
export type GetAssessmentResultsFilteredResponse = ZumiraApiResponse<{ items: AssessmentResult[] }>;

export async function downloadAssessmentResultsReport({
  companyId,
  assessmentId,
}: DownloadAssessmentResultsReportRequest) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/results/admin/download-report?assessmentId=${assessmentId}${
    companyId ? `&companyId=${companyId}` : ""
  }`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "GET",
      headers: {
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

  const blob = await response.blob();

  let filename = "relatório.xlsx";
  const disposition = response.headers.get("Content-Disposition");
  if (disposition) {
    const match = disposition.match(/filename="?(.+?)"?$/);
    if (match?.[1]) filename = match[1];
  }

  return { blob, filename };
}

export async function generateFeedback(assessmentId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  catchError(
    fetch(`${process.env.API_BASE_URL}/assessments/feedback/companies/${assessmentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  const [error, response] = await catchError(
    fetch(`${process.env.API_BASE_URL}/assessments/feedback/users/${assessmentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  const data = (await response.json()) as ZumiraApiResponse<any>;
  if (data.status === "ERROR") {
    throw new Error(data.message);
  }
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

  const parsed = (await response.json()) as GetAssessmentsResponse;

  if (parsed.status === "ERROR") return [];

  return parsed.data.assessments;
}

export async function getAssessmentResultsFiltered(payload: GetAssessmentResultsFilteredRequest) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const params = new URLSearchParams();

  for (const key in payload) {
    const value = payload[key as keyof typeof payload];
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

  const parsed = (await response.json()) as GetAssessmentResultsFilteredResponse;

  if (parsed.status === "ERROR") return [];

  return parsed.data.items;
}
