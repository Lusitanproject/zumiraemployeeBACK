"use server";

import { redirect, RedirectType } from "next/navigation";

import { generateFeedback as generateFeedbackApi } from "@/api/assessments";

export async function generateFeedback(assessmentId: string) {
  await generateFeedbackApi(assessmentId);
  redirect(`/testes/${assessmentId}/devolutiva`, RedirectType.replace);
}
