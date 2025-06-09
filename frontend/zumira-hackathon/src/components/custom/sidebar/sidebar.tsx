"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MainMenu, MenuLink } from "../main-menu";
import { Button } from "@/components/ui/button";
import { ActsData } from "@/types/acts";
import { usePathname } from "next/navigation";
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
        <Button variant="alternate" size="xxl" className={cn({ hidden: false })}>
          <Link href={"#"}>Exibir planos</Link>
        </Button>
      )}
    </aside>
  );
}
