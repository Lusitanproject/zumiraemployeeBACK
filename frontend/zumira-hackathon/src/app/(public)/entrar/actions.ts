"use server";

import { addMinutes } from "date-fns";
import { catchError } from "@/utils/error";
import { EmailAuthResponse, FormState, SignupFormSchema } from "./definitions";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  const cookie = await cookies();

  const validationResult = SignupFormSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email } = validationResult.data;

  const url = `${process.env.API_BASE_URL}/auth/email`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  if (error) {
    return {
      errors: {
        email: [error?.message],
      },
    };
  }

  const data = (await response.json()) as EmailAuthResponse;

  if (data.status === "ERROR") {
    return {
      errors: {
        email: [data.message],
      },
    };
  }

  if (data.status === "SUCCESS") {
    cookie.set("session:verify", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: addMinutes(new Date(), 5),
    });

    redirect("/verificar", RedirectType.push);
  }
}
