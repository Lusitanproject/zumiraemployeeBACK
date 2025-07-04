"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface TabsProps {
  items: {
    label: string;
    href: string;
    disabled?: boolean;
  }[];
}

export function Tabs({ items }: TabsProps) {
  const path = usePathname();

  return (
    <>
      <div className="flex flex-row gap-1 p-1 rounded-xl justify-between max-w-[60%] w-full mx-auto">
        {items.map((item, index) => (
          <Link
            key={index}
            className={cn(
              "p-2 rounded-lg font-semibold text-sm text-text-600",
              path === item.href ? "bg-background-100" : "bg-transparent",
              item.disabled ? "pointer-events-none opacity-20" : "pointer-events-auto"
            )}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <hr className="text-text-200" />
    </>
  );
}
