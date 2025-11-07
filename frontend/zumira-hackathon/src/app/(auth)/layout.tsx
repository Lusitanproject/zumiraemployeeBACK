import HolyLoader from "holy-loader";
import { cookies } from "next/headers";
import { ReactNode } from "react";

import { getActsData } from "@/api/acts";
import { getAlerts } from "@/api/alerts";
import { getNotifications } from "@/api/notifications";
import { Header } from "@/components/custom/header/header";
import { Sidebar } from "@/components/custom/sidebar/sidebar";

import { decrypt } from "../_lib/session";
import { getSidebarContent } from "./action";

type LayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: LayoutProps) {
  const cookie = await cookies();
  const session = decrypt(cookie.get("session")?.value);

  const data = await getActsData();
  const menuLinks = await getSidebarContent();

  const [notifications, alerts] = await Promise.all([
    getNotifications({ filter: "recent", max: 10 }),
    getAlerts({ filter: "recent", max: 10 }),
  ]);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <HolyLoader color="var(--color-primary-400)" />
      <Sidebar data={data} menuItems={menuLinks} />
      <div className="flex flex-col flex-1 bg-background-0 duration-300 overflow-clip min-w-0">
        <Header alerts={alerts} data={data} notifications={notifications} session={session} />
        <div className="relative flex flex-1 overflow-y-auto overflow-x-clip px-4 md:px-16">{children}</div>
      </div>
    </div>
  );
}
