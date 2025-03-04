"use client"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"

import logo from "../../../public/logo-zumira.png"
import { Avatar } from "./avatar"
import { getPageName } from "@/utils/pages"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200 h-20 md:border-0 md:h-24 absolute top-0 right-0 left-0 flex items-center justify-between px-4 md:px-16">
      <div className="">
        <Image src={logo} width={127} height={40} alt="Logo Zumira" className="hidden md:block" />
      </div>

      <div>
        <h4 className="md:hidden text-lg font-semibold text-gray-400">{getPageName(pathname)}</h4>
      </div>

      <div className="flex items-center justify-end gap-x-3">
        <button className="w-11 h-11 ">
          <Bell size={24} className="text-gray-400" />
        </button>
        <Avatar />
      </div>

    </header>
  )
}
