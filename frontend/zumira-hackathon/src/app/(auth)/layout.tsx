import HolyLoader from "holy-loader";
import { ReactNode } from "react";

import { Header } from "@/components/custom/header";
import { Sidebar } from "@/components/custom/sidebar/sidebar";
import { TabBar } from "@/components/custom/tab-bar";

import { getSidebarContent } from "./action";
import { getActsData } from "./actions";

type LayoutProps = {
  children: ReactNode;
};

export default async function AuthLayout({ children }: LayoutProps) {
  const data = await getActsData();
  const menuLinks = await getSidebarContent();

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <HolyLoader color="var(--color-primary-400)" />
      <Sidebar data={data} menuItems={menuLinks} />
      <div className="flex flex-col h-screen w-full md:w-auto md:flex-1 bg-white overflow-clip">
        <Header />
        <div className="relative flex size-full overflow-y-auto px-4 md:px-16">{children}</div>
        <TabBar />
      </div>
    </div>
  );
}
