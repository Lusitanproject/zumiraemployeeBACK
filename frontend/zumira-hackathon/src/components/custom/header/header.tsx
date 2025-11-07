"use client";

import { Menu } from "lucide-react";
import Image from "next/image";

import { CreateSessionProps } from "@/app/_lib/session";
import { eventBus } from "@/eventBus";
import { ActsData } from "@/types/act";
import { Alert } from "@/types/alert";
import { Notification } from "@/types/notification";

import logo from "../../../../public/logo--green.svg";
import ThemeToggle from "../../ui/theme-toggle";
import { Notifications } from "../notifications/notifications";
import { Avatar } from "./components/avatar";
import { MyStory } from "./components/my-story";

type HeaderProps = {
  data: ActsData;
  session: CreateSessionProps | null;
  notifications: Notification[];
  alerts: Alert[];
};

export function Header({ data, session, notifications, alerts }: HeaderProps) {
  return (
    <header className="border-b border-border-200 h-20 md:border-0 md:h-24 top-0 right-0 left-0 flex items-center justify-between px-4 md:px-16">
      <Image alt="Logo Zumira" className="hidden md:block" height={40} src={logo} width={127} />

      <div className="sm:hidden flex">
        <Menu className="size-6 text-text-400" onClick={() => eventBus.emit("toggleSidebar")} />
      </div>

      <div className="flex items-center justify-end gap-x-3">
        <MyStory data={data} />
        <Notifications alerts={alerts} notifications={notifications} />
        <Avatar session={session} />
        <ThemeToggle />
      </div>
    </header>
  );
}
