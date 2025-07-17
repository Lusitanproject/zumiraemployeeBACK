import { Borel } from "next/font/google";
import localFont from "next/font/local";

export const borel = Borel({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const rawline = localFont({
  variable: "--font-rawline",
  display: "swap",
  preload: true,
  src: [
    {
      path: "../../public/fonts/rawline-400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/rawline-500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/rawline-600.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/rawline-700.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});
