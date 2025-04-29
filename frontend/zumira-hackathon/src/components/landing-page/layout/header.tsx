"use client"
import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, ChevronRight } from "lucide-react";

import { AppLink, MainLogo } from "../ui";
import { cn } from "@/lib/utils";
import { MainMenu } from "./main-menu";

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState<boolean>(false)

  const handleToggleMenu = useCallback(() => {
    setOpen(current => !current)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white h-[5.5rem] flex items-center px-4 md:px-12 md:border-b border-gray-50">
      <div className="w-full h-full flex justify-between items-center max-w-[82.5rem] mx-auto">
        <Link href="/">
          <h1 className="w-[123px] h-[32px] sm:w-[132px] md:h-[34px] text-zumira-green">
            <MainLogo />
          </h1>
        </Link>
        <ul className="hidden md:flex gap-x-8 items-center">
          <li className={cn({ "hidden": pathname === "/para-empresas"})}>
            <Link
              href="/para-empresas"
              className="text-lg font-semibold text-slate-800"
            >Para empresas</Link>
          </li>
          <li className={cn({ "hidden": pathname !== "/para-empresas"})}>
            <Link
              href="/"
              className="text-lg font-semibold text-slate-800"
            >Para você</Link>
          </li>
          <li>
            <a
              href="https://api.whatsapp.com/send?phone=5521980791980&text=Gostaria%20de%20solicitar%20uma%20demonstra%C3%A7%C3%A3o%20da%20Zumira"
              target="_blank"
              rel="noopener noreferer"
              className="text-lg font-semibold text-slate-800"
            >Fale Conosco</a>
          </li>
          <li>
            <AppLink
              variant="outline"
              className="w-fit"
              href="/entrar"
            >
              <span className="leading-none mb-1">Acessar plataforma</span>
              <ChevronRight className="size-5 text-gray-500" />
            </AppLink>
          </li>
        </ul>
        <button
          className="w-12 h-12 flex items-center justify-center md:hidden"
          onClick={handleToggleMenu}
        >
          <MenuIcon className="size-6 text-gray-500" />
        </button>
      </div>
      <MainMenu open={open} onDismiss={handleCloseMenu} />
    </header>
  )
}