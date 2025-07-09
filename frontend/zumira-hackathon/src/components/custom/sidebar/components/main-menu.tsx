import { ChevronRight } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type MenuIcon = IconName;

export type MenuLink = {
  href: string;
  label: string;
  icon: MenuIcon;
};

type MainMenuProps = {
  expanded: boolean;
  menu: MenuLink[];
};

export function MainMenu({ expanded, menu }: MainMenuProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col">
      <ul>
        {menu.map((item) => (
          <Link
            key={item.href}
            className={cn(
              "w-full flex items-center justify-start rounded-xl text-text-400 hover:bg-black/5 font-semibold overflow-hidden",
              {
                "px-5 h-11 gap-x-2 grid grid-cols-[20px_minmax(96px,_1fr)_20px]": expanded,
                "h-12 items-center justify-center": !expanded,
                "pr-0": pathname.indexOf(item.href) !== 0,
                "text-text-500": pathname.indexOf(item.href) === 0,
              }
            )}
            href={item.href}
          >
            <DynamicIcon className="flex-shrink-0" name={item.icon} size={20} />
            <span
              className={cn("whitespace-nowrap text-sm text-ellipsis overflow-hidden", {
                hidden: !expanded,
              })}
            >
              {item.label}
            </span>
            <ChevronRight
              className={cn("text-text-500", {
                hidden: pathname.indexOf(item.href) !== 0 || !expanded,
              })}
              size={20}
            />
          </Link>
        ))}
      </ul>
    </nav>
  );
}
