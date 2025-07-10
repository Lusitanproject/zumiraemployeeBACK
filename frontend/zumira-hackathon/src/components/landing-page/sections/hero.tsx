import { ChevronRight } from "lucide-react";
import Image from "next/image";

import { borel } from "@/app/fonts";

import image from "../images/zumira-hero.png";
import { AppLink } from "../ui/link";

export function Hero() {
  return (
    <section className="w-full px-4 md:px-12 pt-[9rem] md:py-[12rem] bg-gradient-to-b from-white to-[#f5f5eb] relative">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div className="flex flex-col w-full mb-0 md:w-1/3">
          <h2 className="text-4xl font-bold leading-[1.25] md:text-5xl md:leading-[1.2] mb-6 text-slate-800">
            Cuidamos do
            <br />
            seu Bem estar
            <br />
            psicológico
          </h2>
          <p className="text-left text-lg leading-normal mb-4 text-slate-700 font-medium">
            Oferecemos uma plataforma de IA
            <br />
            abrangente que oferece suporte <br />
            <span className={`${borel.className} text-zumira-green tracking-normal`}>emocional</span> e assistência
            psicológica.
          </p>
          <AppLink className="w-fit" href="/entrar" variant="primary">
            <span className="leading-none mb-1">Acessar plataforma</span>
            <ChevronRight className="size-5 text-white" />
          </AppLink>
        </div>
        <div className=" overflow-hidden md:w-2/3 md:overflow-visible md:h-full">
          <Image
            alt="Mãos segurando um cérebro"
            className="w-[140%] -ml-[14%] max-w-none md:absolute md:bottom-0 md:right-0 md:w-full md:max-w-[920px]"
            height={654}
            src={image}
            width={869}
          />
        </div>
      </div>
    </section>
  );
}
