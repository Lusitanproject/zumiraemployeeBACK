import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "sonner";

import { rawline } from "./fonts";

export const metadata: Metadata = {
  title: "Zumira",
  description: "Cuidando da Saúde Mental de indivíduos e organizações",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="pt-BR">
      <body className={`${rawline.className} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem("theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  if (stored === "dark" || (!stored && prefersDark)) {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (_) {}
              })();
            `,
          }}
          id="theme-init"
        />
        <Toaster
          position="bottom-right"
          toastOptions={{
            unstyled: true,
            className:
              "flex flex-row gap-4 bg-background-0 border-1 border-border-200 p-4 rounded-xl items-center shadow-xl",
            classNames: {
              error: "text-error-500",
              success: "text-primary-400",
              warning: "text-primary-600",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
