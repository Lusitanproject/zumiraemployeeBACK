import { decrypt } from "@/app/_lib/session";
import { User } from "@/types/user";
import { catchError } from "@/utils/error";
import { cookies } from "next/headers";
import { ZumiraApiResponse } from "./common";

export type GetUsersResponse = ZumiraApiResponse<{ users: User[] }>;

export async function getUsers(): Promise<User[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/users`;

  const [error, response] = await catchError(
    fetch(url, {
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

  const parsed = (await response.json()) as GetUsersResponse;

  if (parsed.status === "ERROR") return [];

  return parsed.data.users;
}
