"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { ZumiraApiResponse } from "./common";

export interface DownloadAssessmentResultsReportRequest {
  assessmentId: string;
  companyId?: string;
}

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
