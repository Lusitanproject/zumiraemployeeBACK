"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/app/_lib/session";
import { ActChapter, ActChatbot, ActsData } from "@/types/acts";
import { catchError } from "@/utils/error";

import { ZumiraApiResponse } from "./common";

export type SaveActChatbotRequest = {
  id: string | undefined;
  name: string;
  description: string;
  messageInstructions?: string;
  compilationInstructions?: string;
  icon: string;
};
export type UpdateActChapterRequest = {
  actChapterId: string;
  compilation: string;
  title: string;
};

export type GetActChapterResponse = ZumiraApiResponse<ActChapter>;
export type GenerateResponseResponse = ZumiraApiResponse<string>;
export type GetActChatbotResponse = ZumiraApiResponse<ActChatbot>;
export type GetActChatbotsResponse = ZumiraApiResponse<{ items: ActChatbot[] }>;
export type NewChapterResponse = ZumiraApiResponse<{
  id: string;
  actChatbot: {
    name: string;
    icon: string;
    description: string;
  };
}>;
export type GetActsDataResponse = ZumiraApiResponse<ActsData>;
export type MoveToNextActResponse = ZumiraApiResponse<{ currActChatbotId: string }>;

export async function getActChapter(chapterId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/chapters?actChapterId=${chapterId}`;

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

  const parsed = (await response.json()) as GetActChapterResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}

export async function generateResponse(body: { actChapterId: string; content: string }) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/message`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
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

  const parsed = (await response.json()) as GenerateResponseResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}

export async function getActChatbot(id: string | null): Promise<ActChatbot | null> {
  if (id === null) {
    return null;
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/admin/${id}`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const parsed = (await response.json()) as GetActChatbotResponse;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}

export async function getActChatbots() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/admin`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) return [];

  const parsed = (await response.json()) as GetActChatbotsResponse;

  if (parsed.status === "ERROR") return [];

  return parsed.data.items;
}

export async function updateManyActChatbots(chatbots: ActChatbot[]) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/admin/update-many`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "PUT",
      body: JSON.stringify({ chatbots }),
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

  const parsed = await response.json();

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }
}

export async function newActChapter(actChatbotId: string, type: "REGULAR" | "ADMIN_TEST") {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/new-chapter`;

  const body = JSON.stringify({ actChatbotId, type });

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      body,
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

  const parsed = (await response.json()) as NewChapterResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}

export async function saveActChatbot(data: SaveActChatbotRequest) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/admin${!data.id ? "" : `/${data.id}`}`;
  const method = !data.id ? "POST" : "PUT";

  const [error, response] = await catchError(
    fetch(url, {
      method,
      body: JSON.stringify(data),
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

  const parsed = (await response.json()) as GetActChatbotResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}

export async function compileActChapter(actChapterId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/chapters/compile`;
  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ actChapterId }),
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

  const parsed = (await response.json()) as GetActChapterResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}

export async function updateActChapter(data: UpdateActChapterRequest) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/chapters/${data.actChapterId}`;
  const [error, response] = await catchError(
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
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

  const parsed = (await response.json()) as GetActChapterResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}

export async function getActsData() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts`;

  const [error, response] = await catchError(
    fetch(url, {
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    throw new Error("Couldn't get acts data");
  }

  const parsed = (await response.json()) as GetActsDataResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data;
}

export async function moveToNextAct() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/acts/next`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error) {
    throw new Error(error?.message);
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const parsed = (await response.json()) as MoveToNextActResponse;

  if (parsed.status === "ERROR") {
    throw new Error(parsed.message);
  }

  return parsed.data.currActChatbotId;
}
