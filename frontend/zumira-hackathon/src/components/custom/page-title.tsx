"use client"

import { usePathname } from "next/navigation"
import { getPageName } from "@/utils/pages"

export function PageTitle() {
  const pathname = usePathname()

  return (
    <div>
      <h4 className="md:hidden text-lg font-semibold text-gray-400">{getPageName(pathname)}</h4>
    </div>
  )
}
