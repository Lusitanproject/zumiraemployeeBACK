import { HeadImage } from "@/components/custom/head-image";
import { ReactNode } from "react";
import { Toaster } from "sonner";

type LayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="w-full h-screen overflow-hidden grid grid-cols-1 md:grid-cols-[58vw_42vw] grid-rows-1">
      <section className="bg-gray-200 flex items-center justify-center">
        <HeadImage size="large" fadeColor="var(--color-gray-200)" />
      </section>
      <div className="h-screen px-4 py-14 bg-white overflow-y-auto">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              backgroundColor: "var(--color-white)",
              color: "var(--color-primary-400)",
              borderColor: "var(--color-gray-300)",
            },
          }}
        />
        {children}
      </div>
    </div>
  );
}
