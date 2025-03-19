import { cookies } from "next/headers";
import { decrypt } from "../_lib/session";
import { MenuLink } from "@/components/custom/main-menu";

export async function getSidebarContent() {
  const cookie = await cookies()
  const session = decrypt(cookie.get("session")?.value)

  const links = [
    { href: "/chat", label: "Início", icon: "house", role: "user" },
    { href: "/automonitoramento", label: "Automonitoramento", icon: "chart-no-axes-column-increasing", role: "user" },
    { href: "/autogestao", label: "Autogestão", icon: "square-pen", role: "user" },
    { href: "/rede-apoio", label: "Rede de Apoio", icon: "users", role: "user" },
    { href: "/biblioteca", label: "Biblioteca", icon: "layout-grid", role: "user" },
    { href: "/admin/automonitoramento", label: "Automonitoramento", icon: "chart-no-axes-column-increasing", role: "admin" },
    { href: "/admin/dimensoes", label: "Dimensões", role: "admin", icon: "brain" },
    { href: "/admin/testes", label: "Testes", role: "admin", icon: "clipboard-list" },
    { href: "/admin/usuarios", label: "Usuários", role: "admin", icon: "users" },
    { href: "/admin/empresas", label: "Empresas", role: "admin", icon: "building-2" },
  ] as const

  const menu: MenuLink[] = links
    .filter(item => item.role === session?.role)
    .map(item => {
      const { href, label, icon } = item
      return { href, label, icon }
    })

  return menu
}
