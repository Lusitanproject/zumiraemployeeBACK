"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { createSession } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { AuthResponse, FormState, VerifyCodeFormSchema } from "./definitions";

export async function verifyCode(state: FormState, formData: FormData): Promise<FormState> {
  const cookie = await cookies();

  const mail = cookie.get("session:verify")?.value;

  if (!mail) {
    redirect("/entrar", RedirectType.replace);
  }

  const validationResult = VerifyCodeFormSchema.safeParse({
    email: mail,
    code: formData.get("code"),
  });

  if (!validationResult.success) {
    return { errors: { input: true } };
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
    })
  );

  if (error) {
    return { errors: { code: error.message } };
  }

  const res = (await response.json()) as AuthResponse;
  if (res.status === "SUCCESS") {
    cookie.delete("session:verify");
    await createSession(res.data);

    const route = res.data.role === "admin" ? "/admin/testes" : "/chat/novo";
    redirect(route, RedirectType.replace);
  } else {
    return { errors: { code: res.message, input: true } };
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
