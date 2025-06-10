"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { FormState, MutateAssessmentResult, SaveAssessmentAnswerSchema } from "../definitions";
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
    redirect(`/autoconhecimento/teste/${data.assessmentId}/concluido`, RedirectType.replace);
  }
}
