"use server";

import { catchError } from "@/utils/error";
import {
  FormState,
  GetNationalitiesResponse,
  RegisterFormSchema,
  RegisterFormState,
  RegisterResponse,
} from "./definitions";
import { redirect, RedirectType } from "next/navigation";

export async function register(state: RegisterFormState): Promise<FormState> {
  const validationResult = RegisterFormSchema.safeParse(state);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const url = `${process.env.API_BASE_URL}/users`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      body: JSON.stringify(validationResult.data),
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  if (error) {
    return {
      errors: {
        response: [error?.message],
      },
    };
  }

  const data = (await response.json()) as RegisterResponse;

  if (data.status === "ERROR") {
    return {
      errors: {
        response: [data.message],
      },
    };
  }

  redirect("/entrar", RedirectType.push);
}

export async function getNationalities() {
  const url = `${process.env.API_BASE_URL}/nationalities`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  if (error) {
    return [];
  }

  const parsed = (await response.json()) as GetNationalitiesResponse;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.items;
}
