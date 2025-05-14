"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  // ChartNoAxesColumnIncreasing,
  House,
  LayoutGrid,
  SquarePen,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/chat", label: "Início", icon: House },
  // { href: "/autoconhecimento", label: "Autoconhecimento", icon: ChartNoAxesColumnIncreasing },
  { href: "/autogestao", label: "Autogestão", icon: SquarePen },
  { href: "/rede-apoio", label: "Rede de Apoio", icon: Users },
  { href: "/biblioteca", label: "Biblioteca", icon: LayoutGrid },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden absolute bottom-0 left-0 right-0 border-t border-gray-200 px-6 pt-7 pb-14 bg-white">
      <ul className="flex justify-between items-center">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("w-fit flex items-center h-9 rounded-xl", {
              "bg-primary-300 text-primary-25 gap-x-3 px-3": pathname.indexOf(item.href) === 0,
              "text-gray-500/60": pathname.indexOf(item.href) !== 0,
            })}
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
