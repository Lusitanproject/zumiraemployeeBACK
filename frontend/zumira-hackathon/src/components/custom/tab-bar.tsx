"use client";

import { House, SquarePen, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/chat", label: "Início", icon: House },
  { href: "/testes", label: "Testes", icon: SquarePen },
  { href: "/rede-apoio", label: "Rede de Apoio", icon: Users },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden border-t border-border-200 px-6 py-7 bg-background-0">
      <ul className="flex justify-between items-center">
        {links.map((item) => (
          <Link
            key={item.href}
            className={cn("w-fit flex items-center h-9 rounded-xl", {
              "bg-black/5 text-text-900 gap-x-3 px-3": pathname.indexOf(item.href) === 0,
              "text-text-500/60": pathname.indexOf(item.href) !== 0,
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
