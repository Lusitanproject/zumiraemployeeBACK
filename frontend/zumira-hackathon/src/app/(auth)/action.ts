import { headers } from "next/headers";
import { MenuLink } from "@/components/custom/main-menu";

export async function getSidebarContent() {
  const heads = await headers();
  const path = heads.get("x-current-path") || "";
  const isAdminRoute = path.includes("/admin");

  const links = [
    { href: "/chat", label: "Início", icon: "house", role: "user" },
    // { href: "/autoconhecimento", label: "Autoconhecimento", icon: "chart-no-axes-column-increasing", role: "user" },
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
  ] as const;

  const menu: MenuLink[] = links
    .filter((item) => item.role === (isAdminRoute ? "admin" : "user"))
    .map((item) => {
      const { href, label, icon } = item;
      return { href, label, icon };
    });

  return menu;
}
