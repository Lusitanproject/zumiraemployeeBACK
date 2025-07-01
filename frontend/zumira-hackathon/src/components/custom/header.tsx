import Image from "next/image";

import logo from "../../../public/logo--green.svg";
import { BackButton } from "../ui/back-button";
import { Avatar } from "./avatar";
import { Notifications } from "./notifications/notifications";
import { PageTitle } from "./page-title";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 h-20 md:border-0 md:h-24 top-0 right-0 left-0 flex items-center justify-between px-4 md:px-16">
      <Image alt="Logo Zumira" className="hidden md:block" height={40} src={logo} width={127} />

      <div className="sm:hidden flex">
        <BackButton />
      </div>

      <PageTitle />

      <div className="flex items-center justify-end gap-x-3">
        <Link href="/minha-historia">
          <Button>
            <div className="flex flex-row gap-1 items-center">
              <Bookmark className="text-primary-400 size-4.5" />
              <span className="text-gray-700">Minha história</span>
            </div>
          </Button>
        </Link>
        <Notifications />
        <Avatar />
      </div>
    </header>
  );
}
