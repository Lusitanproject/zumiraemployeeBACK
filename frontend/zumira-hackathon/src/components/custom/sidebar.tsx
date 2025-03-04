"use client"
import { useCallback, useState } from "react"
import { UnfoldHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { MainMenu } from "./main-menu"
import { Button } from "../ui/button"

export function Sidebar() {
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
            <UnfoldHorizontal color="white" />
          </button>
        </div>
        <MainMenu expanded={expanded} />
      </div>
      <Button variant="secondary" size="xxl" className={cn({ "hidden": !expanded })}>Preciso de ajuda</Button>
    </aside>
  )
}
