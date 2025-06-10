import { headers } from "next/headers";
import { MenuLink } from "@/components/custom/main-menu";

export async function getSidebarContent() {
  const heads = await headers();
  const path = heads.get("x-current-path") || "";
  const isAdminRoute = path.includes("/admin");

  const links = [
    { href: "/autoconhecimento", label: "Autoconhecimento", icon: "square-pen", role: "user" },
    { href: "#", label: "Analytics", icon: "chart-no-axes-combined", role: "user" },
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
