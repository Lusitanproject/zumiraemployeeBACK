import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChartNoAxesColumnIncreasing, ChevronRight, House, LayoutGrid, SquarePen, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/chat", label: "Início", icon: House },
  { href: "/automonitoramento", label: "Automonitoramento", icon: ChartNoAxesColumnIncreasing },
  { href: "/autogestao", label: "Autogestão", icon: SquarePen },
  { href: "/rede-apoio", label: "Rede de Apoio", icon: Users },
  { href: "/biblioteca", label: "Biblioteca", icon: LayoutGrid },
] as const

type MainMenuProps = {
  expanded: boolean
}

export function MainMenu({ expanded }: MainMenuProps){
  const pathname = usePathname()

  return (
    <nav className="flex flex-col">
      <ul>
        {links.map(item =>  (
          <Link
            key={item.href}
            href={item.href}
            className={cn("w-full flex items-center justify-start rounded-xl text-white font-semibold overflow-hidden", {
              "px-5 h-11 gap-x-2 grid grid-cols-[20px_minmax(96px,_1fr)_20px]": expanded,
              "h-12 items-center justify-center": !expanded,
              "border-b border-gray-100/20 rounded-none pr-0": pathname.indexOf(item.href) !== 0,
              "bg-primary-600": pathname.indexOf(item.href) === 0
            })}
          >
            <item.icon size={20} className="flex-shrink-0"/>
            <span
              className={cn("whitespace-nowrap text-sm text-ellipsis overflow-hidden", {
                "hidden": !expanded
              })}
            >{item.label}</span>
            <ChevronRight
              size={20}
              className={cn("text-white/50", {
                "hidden": pathname.indexOf(item.href) !== 0 || !expanded
                }
              )}
            />
          </Link>
        ))}
      </ul>
    </nav>
  )
}
