"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";

import { Company, GetCompaniesResponse, GetRolesResponse, GetUserResponse, Role, User } from "./definitions";

export async function getUserData(userId: string | null): Promise<User | null> {
  if (userId === null) {
    return null;
  }

  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/users/${userId}`;

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

  const parsed = (await response.json()) as GetUserResponse;

  if (parsed.status === "ERROR") {
    return null;
  }

  return parsed.data;
}

export async function getCompanies(): Promise<Company[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/companies`;

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

  const parsed = (await response.json()) as GetCompaniesResponse;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.companies;
}

export async function getRoles(): Promise<Role[]> {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/roles`;

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

  const parsed = (await response.json()) as GetRolesResponse;

  if (parsed.status === "ERROR") {
    return [];
  }

  return parsed.data.roles;
}

export async function deleteUser(userId: string) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const url = `${process.env.API_BASE_URL}/users/${userId}`;

  const [error, response] = await catchError(
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
  );

  if (error || !response.ok) {
    throw new Error("Erro ao deletar usuário");
  }

  const parsed = await response.json();
  if (parsed.status === "ERROR") throw new Error(parsed.message);

  redirect("/admin/usuarios");
}
