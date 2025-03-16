"use client"
import { useCallback, useState } from "react"
import { CircleArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { MainMenu, MenuLink } from "./main-menu"
import { Button } from "../ui/button"

type SidebarProps = {
  menuItems: MenuLink[]
}

export function Sidebar({ menuItems }: SidebarProps) {
  const [expanded, setExpanded] = useState<boolean>(true)

  const handleToggleExpanded = useCallback(() => {
    setExpanded(current => !current)
  }, [])

  return (
    <aside
      className={cn("hidden md:flex flex-col justify-between h-screen bg-primary-400 py-12 transition-all transition-discrete overflow-hidden", {
        "px-12 w-[18rem]": expanded,
        "px-4 w-[5rem]": !expanded,
      })}
    >
      <div className="w-full flex flex-col">
        <div className={cn("w-full flex justify-center mb-14", { "justify-end": expanded })}>
          <button className="w-6 h-6" onClick={handleToggleExpanded}>
            <CircleArrowLeft color="white" />
          </button>
        </div>
        <MainMenu expanded={expanded} menu={menuItems}/>
      </div>
      <Button variant="secondary" size="xxl" className={cn({ "hidden": !expanded })}>Preciso de ajuda</Button>
    </aside>
  )
}
