import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en">
      <body className={`${rawline.className} antialiased`}>{children}</body>
    </html>
  );
}
