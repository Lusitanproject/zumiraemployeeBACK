import Image from "next/image";

import { ActsData } from "@/types/act";

import logo from "../../../../public/logo--green.svg";
import { BackButton } from "../../ui/back-button";
import ThemeToggle from "../../ui/theme-toggle";
import { Notifications } from "../notifications/notifications";
import { Avatar } from "./components/avatar";
import { MyStory } from "./components/my-story";

type HeaderProps = {
  data: ActsData;
};

export function Header({ data }: HeaderProps) {
  return (
    <header className="border-b border-border-200 h-20 md:border-0 md:h-24 top-0 right-0 left-0 flex items-center justify-between px-4 md:px-16">
      <Image alt="Logo Zumira" className="hidden md:block" height={40} src={logo} width={127} />

      <div className="sm:hidden flex">
        <BackButton />
      </div>

      <div className="flex items-center justify-end gap-x-3">
        <MyStory data={data} />
        <Notifications />
        <Avatar />
        <ThemeToggle />
      </div>
    </header>
  );
}
