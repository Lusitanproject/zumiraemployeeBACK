"use server";

import { catchError } from "@/utils/error";
import { AuthResponse, FormState, VerifyCodeFormSchema } from "./definitions";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";
import { createSession } from "@/app/_lib/session";

export async function verifyCode(state: FormState, formData: FormData): Promise<FormState> {
  const cookie = await cookies();

  const mail = cookie.get("session:verify")?.value;

  // if (!mail) {
  //   redirect("/entrar", RedirectType.replace)
  // }

  const validationResult = VerifyCodeFormSchema.safeParse({
    email: mail,
    code: formData.get("code"),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, code } = validationResult.data;

  const url = `${process.env.API_BASE_URL}/auth/verify`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ email, code }),
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );

  if (error) {
    return {
      errors: {
        email: [error.message],
      },
    };
  }

  if (response.ok) {
    cookie.delete("session:verify");
    const res = (await response.json()) as AuthResponse;
    await createSession(res.data);

    const route = res.data.role === "admin" ? "/admin/testes" : "/chat";
    redirect(route, RedirectType.replace);
  }
}

export async function resendCode() {
  const cookie = await cookies();
  const email = cookie.get("session:verify")?.value;

  const url = `${process.env.API_BASE_URL}/auth/email`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
