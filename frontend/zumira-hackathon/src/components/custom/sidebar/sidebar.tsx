"use client";
import { ChevronsLeftRight, ChevronsRightLeft, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { ActsData } from "@/types/act";

import { ActsMenu } from "./components/acts-menu";
import { MainMenu, MenuLink } from "./components/main-menu";

type SidebarProps = {
  menuItems: MenuLink[];
  data: ActsData;
};

export function Sidebar({ menuItems, data }: SidebarProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col justify-between bg-background-200 transition-all transition-discrete scrollbar-hide pb-12 pt-8 h-screen gap-4",
        expanded ? "px-12 w-[18rem]" : "px-4 w-22"
      )}
    >
      <div className={cn("flex w-full", expanded ? "justify-end" : "justify-center")}>
        <button
          className="text-primary-600 rounded-full border-[1.5px] border-primary-600 p-0.5 cursor-pointer"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? (
            <ChevronsRightLeft className="size-4" strokeWidth={3} />
          ) : (
            <ChevronsLeftRight className="size-4" strokeWidth={3} />
          )}
        </button>
      </div>

      <div className="size-full flex flex-col gap-4 flex-1 min-h-0 pt-2">
        {!isAdminRoute && (
          <>
            <ActsMenu data={data} expanded={expanded} />
            <hr className="text-text-300 flex-none" />
          </>
        )}
        <div className="flex-none">
          <MainMenu expanded={expanded} menu={menuItems} />
        </div>
      </div>
      {!isAdminRoute && (
        <span className="flex flex-row items-center justify-center gap-1.5 text-text-500 font-semibold text-sm mt-48">
          <ShieldCheck className="size-6 flex-none" />
          {expanded && <span className="text-nowrap">Espaço seguro e confidencial</span>}
        </span>
      )}
    </aside>
  );
}
