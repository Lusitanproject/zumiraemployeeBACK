"use client";
import {
  // ChartNoAxesColumnIncreasing,
  House,
  LayoutGrid,
  SquarePen,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/chat", label: "Início", icon: House },
  // { href: "/autoconhecimento", label: "Autoconhecimento", icon: ChartNoAxesColumnIncreasing },
  { href: "/autoconhecimento", label: "Autoconhecimento", icon: SquarePen },
  { href: "/rede-apoio", label: "Rede de Apoio", icon: Users },
  { href: "/biblioteca", label: "Biblioteca", icon: LayoutGrid },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden border-t border-gray-200 px-6 py-7 bg-white">
      <ul className="flex justify-between items-center">
        {links.map((item) => (
          <Link
            key={item.href}
            className={cn("w-fit flex items-center h-9 rounded-xl", {
              "bg-primary-300 text-primary-25 gap-x-3 px-3": pathname.indexOf(item.href) === 0,
              "text-gray-500/60": pathname.indexOf(item.href) !== 0,
            })}
            href={item.href}
          >
            <item.icon size={24} />
            <span
              className={cn({
                "font-bold text-sm": pathname.indexOf(item.href) === 0,
                hidden: pathname.indexOf(item.href) !== 0,
              })}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
