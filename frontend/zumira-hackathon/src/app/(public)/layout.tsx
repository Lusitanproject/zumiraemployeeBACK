import { ReactNode } from "react";

import { HeadImage } from "@/components/custom/head-image";

type LayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="w-full h-screen overflow-hidden grid grid-cols-1 md:grid-cols-[58vw_42vw] grid-rows-1">
      <section className="bg-background-200 flex items-center justify-center">
        <HeadImage fadeColor="var(--color-background-200)" size="large" />
      </section>
      <div className="h-screen px-4 py-14 bg-background-0 overflow-y-auto">{children}</div>
    </div>
  );
}
