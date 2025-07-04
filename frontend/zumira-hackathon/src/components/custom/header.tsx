import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import logo from "../../../public/logo--green.svg";
import { BackButton } from "../ui/back-button";
import ThemeToggle from "../ui/theme-toggle";
import { Avatar } from "./avatar";
import { Notifications } from "./notifications/notifications";

export function Header() {
  return (
    <header className="border-b border-border-200 h-20 md:border-0 md:h-24 top-0 right-0 left-0 flex items-center justify-between px-4 md:px-16">
      <Image alt="Logo Zumira" className="hidden md:block" height={40} src={logo} width={127} />

      <div className="sm:hidden flex">
        <BackButton />
      </div>

      <div className="flex items-center justify-end gap-x-3">
        <Link
          className="flex justify-center items-center px-3 py-1.5 border-1 border-border-300 hover:border-primary-400 duration-200 cursor-pointer hover:bg-background-50 rounded-xl"
          href="/minha-historia"
        >
          <div className="flex flex-row gap-1 items-center">
            <Bookmark className="text-primary-400 size-4.5" />
            <span className="text-text-700">Minha história</span>
          </div>
        </Link>
        <Notifications />
        <Avatar />
        <ThemeToggle />
      </div>
    </header>
  );
}
