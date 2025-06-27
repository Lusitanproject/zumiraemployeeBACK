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
    <html lang="pt-BR">
      <body className={`${rawline.className} antialiased`}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            unstyled: true,
            className: "flex flex-row gap-4 bg-white border-1 border-gray-200 p-4 rounded-xl items-center shadow-xl",
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
