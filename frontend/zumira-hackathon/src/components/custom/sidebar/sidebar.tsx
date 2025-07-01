"use client";
import { ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActsData } from "@/types/acts";

import { MainMenu, MenuLink } from "../main-menu";
import { ActsMenu } from "./components/acts-menu";

type SidebarProps = {
  menuItems: MenuLink[];
  data: ActsData;
};

export function Sidebar({ menuItems, data }: SidebarProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col justify-between h-screen bg-gray-200 py-12 transition-all transition-discrete overflow-y-scroll overflow-x-visible scrollbar-hide px-12 w-[18rem] gap-4"
      )}
    >
      <div className="w-full flex flex-col pt-10 gap-4">
        {!isAdminRoute && <ActsMenu data={data} />}
        <MainMenu expanded={true} menu={menuItems} />
      </div>
      {!isAdminRoute && (
        <span className="flex flex-row items-center justify-center gap-1.5 text-gray-500 font-semibold text-sm">
          <ShieldCheck className="size-6 flex-none" />
          <span className="text-nowrap">Espaço seguro e confidencial</span>
        </span>
      )}
    </aside>
  );
}
