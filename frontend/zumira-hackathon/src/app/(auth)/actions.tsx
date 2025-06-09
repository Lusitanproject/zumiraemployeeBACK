import { headers } from "next/headers";
import { MenuLink } from "@/components/custom/main-menu";
import { decrypt } from "@/app/_lib/session";
import { catchError } from "@/utils/error";
import { cookies } from "next/headers";
import { GetActsDataResponse } from "./definitions";

export async function getSidebarContent() {
  const heads = await headers();
  const path = heads.get("x-current-path") || "";
  const isAdminRoute = path.includes("/admin");

  const links = [
    { href: "/chat", label: "Início", icon: "house", role: "user" },
    { href: "/autoconhecimento", label: "Autoconhecimento", icon: "square-pen", role: "user" },
    { href: "/rede-apoio", label: "Rede de Apoio", icon: "users", role: "user" },
    { href: "/biblioteca", label: "Biblioteca", icon: "layout-grid", role: "user" },
    {
      href: "/admin/autoconhecimento",
      label: "Autoconhecimento",
      icon: "chart-no-axes-column-increasing",
      role: "admin",
    },
    { href: "/admin/dimensoes", label: "Dimensões", role: "admin", icon: "brain" },
    { href: "/admin/testes", label: "Testes", role: "admin", icon: "clipboard-list" },
    { href: "/admin/usuarios", label: "Usuários", role: "admin", icon: "users" },
    { href: "/admin/empresas", label: "Empresas", role: "admin", icon: "building-2" },
    { href: "/admin/notificacoes", label: "Notificações", role: "admin", icon: "mails" },
    { href: "/admin/alertas", label: "Alertas", role: "admin", icon: "circle-alert" },
    { href: "/admin/atos", label: "Atos", role: "admin", icon: "messages-square" },
  ] as const;

  const menu: MenuLink[] = links
    .filter((item) => item.role === (isAdminRoute ? "admin" : "user"))
    .map((item) => {
      const { href, label, icon } = item;
      return { href, label, icon };
    });

  return menu;
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
