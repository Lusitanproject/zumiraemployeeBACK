import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { DynamicIcon } from "lucide-react/dynamic"
import { cn } from "@/lib/utils"

export type MenuIcon = 
| "house"
| "chart-no-axes-column-increasing"
| "square-pen"
| "users"
| "layout-grid"
| "clipboard-list"

export type MenuLink = {
  href: string
  label: string
  icon: MenuIcon
}

type MainMenuProps = {
  expanded: boolean
  menu: MenuLink[]
}

export function MainMenu({ expanded, menu }: MainMenuProps){
  const pathname = usePathname()

  return (
    <nav className="flex flex-col">
      <ul>
        {menu.map(item =>  (
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
            <DynamicIcon name={item.icon} size={20} className="flex-shrink-0"/>
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
