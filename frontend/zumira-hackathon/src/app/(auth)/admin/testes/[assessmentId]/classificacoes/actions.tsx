"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { ManageRatingState } from "./context/types";
import { GetAssessmentRatings, UpdateAssessmentRatings } from "./definitions";

export async function getAssessmentRatings(assessmentId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/ratings/${assessmentId}`;

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

  const parsed = (await response.json()) as GetAssessmentRatings;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.items;
}

export async function updateAssessmentRatings(assessmentId: string, state: ManageRatingState) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/ratings/${assessmentId}`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(state),
    })
  );

  if (error) {
    return { status: "ERROR", message: error.message };
  }

  if (!response.ok) {
    return { status: "ERROR", message: response.statusText };
  }

  const parsed = (await response.json()) as UpdateAssessmentRatings;

  return parsed;
}
