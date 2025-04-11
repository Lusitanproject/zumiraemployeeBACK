"use server";

import { cookies } from "next/headers";
import { AssessmentQuestion, ManageQuestion } from "./definitions";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { Dimension } from "../../../dimensoes/definitions";

type GetAssessmentQuestions =
  | { status: "ERROR"; message: string }
  | { status: "SUCCESS"; data: { questions: AssessmentQuestion[] } };

type GetDimensionsByBlock =
  | { status: "SUCCESS"; data: { dimensions: Dimension[] } }
  | { status: "ERROR"; message: string };

type UpdateAssessmentQuestions =
  | { status: "SUCCESS"; data: Record<string, never> }
  | { status: "ERROR"; message: string };

export async function getAssessmentQuestions(assessmentId: string): Promise<GetAssessmentQuestions> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/questions/${assessmentId}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return { status: "ERROR", message: error.message };
  }

  if (!response.ok) {
    return { status: "ERROR", message: response.statusText };
  }

  const parsed = (await response.json()) as GetAssessmentQuestions;

  if (parsed.status === "ERROR") {
    return parsed;
  }

  return parsed;
}

export async function getDimensionsByBlock(blockId: string): Promise<Dimension[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/self-monitoring/dimensions/${blockId}`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "GET",
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

  const parsed = (await response.json()) as GetDimensionsByBlock;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.dimensions;
}

export async function updateAssessmentQuestions(assessmentId: string, questions: ManageQuestion[]) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/assessments/questions/${assessmentId}`;

  const body = {
    questions: questions.map((q) => ({
      id: q.id,
      description: q.description,
      index: q.index,
      psychologicalDimensionId: q.psychologicalDimensionId,
      choices: q.assessmentQuestionChoices.map((c) => ({
        id: c.id,
        label: c.label,
        value: c.value,
        index: c.index,
      })),
    })),
  };

  const [error, response] = await catchError(
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify(body),
    })
  );

  if (error) {
    return { status: "ERROR", message: error.message };
  }

  if (!response.ok) {
    return { status: "ERROR", message: response.statusText };
  }

  const parsed = (await response.json()) as UpdateAssessmentQuestions;

  return parsed;
}
