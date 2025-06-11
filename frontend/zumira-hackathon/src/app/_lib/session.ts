import { isAfter } from "date-fns";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type CreateSessionProps = {
  name: string;
  act: string;
  role: string;
  token: string;
  expiresAt: Date;
};

export function decrypt(data: string | undefined): CreateSessionProps | null {
  if (!data) {
    return null;
  }

  return JSON.parse(data) as CreateSessionProps;
}

export function isExpired(date: Date) {
  return isAfter(date, new Date());
}

export async function createSession(data: CreateSessionProps) {
  const cookie = await cookies();
  cookie.set("session", JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(data.expiresAt),
  });
}

export async function verifySession() {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  if (!session) {
    redirect("/entrar");
  }

  if (isExpired(session.expiresAt)) {
    redirect("/entrar");
  }
}

export async function deleteSession() {
  const cookie = await cookies();
  cookie.delete("session");
  redirect("/entrar");
}
