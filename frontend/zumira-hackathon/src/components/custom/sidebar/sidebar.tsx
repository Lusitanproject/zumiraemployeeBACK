"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
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
        "hidden md:flex flex-col justify-between h-screen bg-gray-200 py-12 transition-all transition-discrete overflow-scroll scrollbar-hide px-12 w-[18rem] gap-4"
      )}
    >
      <div className="w-full flex flex-col pt-10 gap-4">
        {!isAdminRoute && <ActsMenu data={data} />}
        <MainMenu expanded={true} menu={menuItems} />
      </div>
      {!isAdminRoute && (
        <Button className={cn({ hidden: false })} size="xxl" variant="alternate">
          <Link href={"#"}>Exibir planos</Link>
        </Button>
      )}
    </aside>
  );
}
