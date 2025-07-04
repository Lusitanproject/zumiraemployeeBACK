"use client";
import { ChevronRight, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

import { AppLink, MainLogo } from "../ui";
import { MainMenu } from "./main-menu";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<boolean>(false);

  const handleToggleMenu = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-background-0 h-[5.5rem] flex items-center px-4 md:px-12 md:border-b border-border-50">
      <div className="w-full h-full flex justify-between items-center max-w-[82.5rem] mx-auto">
        <Link href="/">
          <h1 className="w-[123px] h-[32px] sm:w-[132px] md:h-[34px] text-zumira-green">
            <MainLogo />
          </h1>
        </Link>
        <ul className="hidden md:flex gap-x-8 items-center">
          <li className={cn({ hidden: pathname === "/para-empresas" })}>
            <Link className="text-lg font-semibold text-slate-800" href="/para-empresas">
              Para empresas
            </Link>
          </li>
          <li className={cn({ hidden: pathname !== "/para-empresas" })}>
            <Link className="text-lg font-semibold text-slate-800" href="/">
              Para você
            </Link>
          </li>
          <li>
            <a
              className="text-lg font-semibold text-slate-800"
              href="https://api.whatsapp.com/send?phone=5521980791980&text=Gostaria%20de%20solicitar%20uma%20demonstra%C3%A7%C3%A3o%20da%20Zumira"
              rel="noopener noreferer"
              target="_blank"
            >
              Fale Conosco
            </a>
          </li>
          <li>
            <AppLink className="w-fit" href="/entrar" variant="outline">
              <span className="leading-none mb-1">Acessar plataforma</span>
              <ChevronRight className="size-5 text-text-500" />
            </AppLink>
          </li>
        </ul>
        <button className="w-12 h-12 flex items-center justify-center md:hidden" onClick={handleToggleMenu}>
          <MenuIcon className="size-6 text-text-500" />
        </button>
      </div>
      <MainMenu open={open} onDismiss={handleCloseMenu} />
    </header>
  );
}
