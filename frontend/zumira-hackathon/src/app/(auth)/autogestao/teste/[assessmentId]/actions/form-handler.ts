"use server";

import { cookies } from "next/headers";
import { FormState, MutateAssessmentResult, SaveAssessmentAnswerSchema } from "../definitions";
import { catchError } from "@/utils/error";
import { decrypt } from "@/app/_lib/session";
import { redirect, RedirectType } from "next/navigation";
import { getFormAnswersData } from "./util";

export async function saveAnswersAction(tate: FormState, formData: FormData): Promise<FormState> {
  const data = getFormAnswersData(formData);

  const validationResult = SaveAssessmentAnswerSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/results`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      body: JSON.stringify(validationResult.data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return {
      errors: {
        assessmentId: [error?.message],
      },
    };
  }

  if (!response.ok) {
    return {
      errors: {
        assessmentId: [response.statusText],
      },
    };
  }

  const result = (await response.json()) as MutateAssessmentResult;

  if (result.status === "SUCCESS") {
    fetch(`${process.env.API_BASE_URL}/assessments/feedback/${data.assessmentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });

    redirect("/autogestao/teste/concluido", RedirectType.replace);
  }
}
