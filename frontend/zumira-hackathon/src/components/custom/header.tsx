import Image from "next/image";
import { Bell } from "lucide-react";

import logo from "../../../public/logo--green.svg";
import { Avatar } from "./avatar";
import { PageTitle } from "./page-title";

export function Header() {
  return (
    <header className="border-b border-gray-200 h-20 md:border-0 md:h-24 absolute top-0 right-0 left-0 flex items-center justify-between px-4 md:px-16">
      <div className="">
        <Image src={logo} width={127} height={40} alt="Logo Zumira" className="hidden md:block" />
      </div>

      <PageTitle />

      <div className="flex items-center justify-end gap-x-3">
        <button className="w-11 h-11 ">
          <Bell size={24} className="text-gray-400" />
        </button>
        <Avatar />
      </div>
    </header>
  );
}
