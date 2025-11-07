"use client";
import { ChevronsLeftRight, ChevronsRightLeft, Menu, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { eventBus } from "@/eventBus";
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
  const [expanded, setExpanded] = useState<boolean>(true);
  const [hidden, setHidden] = useState<boolean>(true);

  useEffect(() => {
    const listener = () => {
      setHidden((prev) => !prev);
    };

    eventBus.on("toggleSidebar", listener);
    return () => {
      eventBus.off("toggleSidebar", listener);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebarElement = document.querySelector("aside");
      if (!hidden && sidebarElement && !sidebarElement.contains(event.target as Node)) {
        setHidden(true);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [hidden]);

  useEffect(() => {
    setHidden(true);
  }, [pathname]);

  return (
    <aside
      className={cn(
        "absolute sm:shadow-none shadow-xl sm:static sm:z-0 z-50 flex duration-500 flex-col justify-between bg-background-200 transition-all transition-discrete scrollbar-hide pb-12 pt-8 h-full gap-4",
        hidden ? "-translate-x-full sm:translate-x-0" : "translate-x-0",
        expanded ? "sm:px-12 px-7 w-[18rem]" : "px-4 w-20"
      )}
    >
      <div className={cn("flex w-full", expanded ? "justify-end" : "justify-center")}>
        <button
          className="sm:block hidden text-primary-600 rounded-full border-[1.5px] border-primary-600 p-0.5 cursor-pointer"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? (
            <ChevronsRightLeft className="size-4" strokeWidth={3} />
          ) : (
            <ChevronsLeftRight className="size-4" strokeWidth={3} />
          )}
        </button>

        <Menu className="size-7 sm:hidden block text-primary-600" onClick={() => setHidden(true)} />
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
        <span className="flex flex-row items-center justify-center gap-1.5 text-text-500 font-semibold text-sm sm:mt-48 mt-12">
          <ShieldCheck className="size-6 flex-none" />
          {expanded && <span className="text-nowrap">Espaço seguro e confidencial</span>}
        </span>
      )}
    </aside>
  );
}
