
import localFont from "next/font/local";
import { Borel } from "next/font/google";

export const borel = Borel({
  weight: "400",
  subsets: ["latin"],
  display: "swap"
})

export const rawline = localFont({
  variable: "--font-rawline",
  display: "swap",
  preload: true,
  src: [
    {
      path: "./rawline-400.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./rawline-500.ttf",
      weight: "500",
      style: "normal"
    },
    {
      path: "./rawline-600.ttf",
      weight: "600",
      style: "normal"
    },
    {
      path: "./rawline-700.ttf",
      weight: "700",
      style: "normal"
    },
  ]
})
