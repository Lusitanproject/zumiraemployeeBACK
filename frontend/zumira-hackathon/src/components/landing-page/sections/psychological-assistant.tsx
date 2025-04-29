import Image from "next/image";
import { borel } from "@/app/fonts";

import image from "../images/zumira-picture4.png";

export function PsychologicalAssistant() {
  return (
    <section className="w-full px-4 py-20 sm:py-32 bg-[#f5f5eb]">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
        <div className="flex flex-col w-full mb-16 sm:mb-0 sm:w-1/2 order-1 sm:order-2">
          <h2 className="text-3xl font-bold leading-[1.25] sm:text-4xl sm:leading-[1.2] mb-6 text-slate-800">Sua assistente <span className={`${borel.className} tracking-normal`}>Psicológica</span></h2>
          <p className="text-left text-lg leading-normal mb-4 text-slate-700 font-medium"><strong>Zumira</strong> é mais do que uma assistente virtual. É uma companheira para aqueles que buscam acolhimento emocional e autodescoberta.</p>
          <p className="text-left text-lg leading-normal mb-4 text-slate-700 font-medium">Nascida de uma pesquisa de mestrado aprofundada sobre desenvolvimento pessoal e identidade vocacional, a Zumira fornece suporte acessível e empático para aqueles que enfrentam desafios emocionais e profissionais. Utilizando a narrativa autobiográfica como base, nossa IA é projetada para ajudar você a construir uma visão positiva e coerente de si mesmo, especialmente em tempos de incerteza.</p>
        </div>
        <div className="overflow-hidden order-2 sm:order-1 sm:w-1/3">
          <Image src={image} alt=""  />
        </div>
      </div>
    </section>
  )
}