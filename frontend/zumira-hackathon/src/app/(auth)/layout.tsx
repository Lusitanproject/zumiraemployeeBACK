import { ReactNode } from "react";
import { Header } from "@/components/custom/header";
import { TabBar } from "@/components/custom/tab-bar";
import { getSidebarContent } from "./action";
import HolyLoader from "holy-loader";
import { Sidebar } from "@/components/custom/sidebar/sidebar";
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
      <Sidebar menuItems={menuLinks} data={data} />
      <div className="relative h-screen w-full md:w-auto md:flex-1 bg-white overflow-clip pt-20 md:pt-24 pb-[121px] md:pb-6">
        <div className="h-full overflow-y-auto px-4 md:px-16">{children}</div>
        <Header />
        <TabBar />
      </div>
    </div>
  );
}
