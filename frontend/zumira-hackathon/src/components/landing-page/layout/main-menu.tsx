"use client";
import { ChevronRight, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { AppLink, MainLogo } from "../ui";

type MainMenuProps = {
  open: boolean;
  onDismiss: () => void;
};

export function MainMenu({ open, onDismiss }: MainMenuProps) {
  const pathname = usePathname();

  if (!open) {
    return <></>;
  }

  return (
    <div className="fixed inset-0 bg-background-0 md:hidden">
      <header className="w-full h-[5.5rem] flex items-center px-4 border-b border-border-50">
        <div className="w-full h-full flex justify-between items-center">
          <Link href="/">
            <h1 className="w-[123px] h-[32px] sm:w-[132px] md:h-[34px] text-zumira-green">
              <MainLogo />
            </h1>
          </Link>

          <button className="w-12 h-12 flex items-center justify-center" onClick={onDismiss}>
            <XIcon className="size-6 text-text-500" />
          </button>
        </div>
      </header>
      <ul className="flex flex-col px-4">
        <li className={cn({ hidden: pathname === "/para-empresas" })} onClick={onDismiss}>
          <Link className="flex py-3 text-lg font-semibold text-slate-800" href="/para-empresas">
            Para empresas
          </Link>
        </li>
        <li className={cn({ hidden: pathname !== "/para-empresas" })} onClick={onDismiss}>
          <Link className="flex py-3 text-lg font-semibold text-slate-800" href="/">
            Para você
          </Link>
        </li>
        <li onClick={onDismiss}>
          <a
            className="flex py-3 text-lg font-semibold text-slate-800"
            href="https://api.whatsapp.com/send?phone=5521980791980&text=Gostaria%20de%20solicitar%20uma%20demonstra%C3%A7%C3%A3o%20da%20Zumira"
            rel="noopener noreferer"
            target="_blank"
          >
            Fale Conosco
          </a>
        </li>
        <li>
          <AppLink className="w-fit my-3" href="https://www.zumira.com.br" variant="outline">
            <span className="leading-none mb-1">Acessar plataforma</span>
            <ChevronRight className="size-5 text-text-500" />
          </AppLink>
        </li>
      </ul>
    </div>
  );
}
