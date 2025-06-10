import Image from "next/image";

import { borel } from "@/app/fonts";

import image from "../images/zumira-picture2.png";

export function Connect() {
  return (
    <section className="w-full px-4 py-20 sm:py-32 bg-zumira-green">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
        <div className="flex flex-col w-full mb-16 sm:mb-0 sm:w-1/2 order-1 sm:order-2">
          <h2 className="text-3xl font-bold leading-[1.25] sm:text-4xl sm:leading-[1.2] mb-6 text-white">Como Zumira<br />conecta-se com você?</h2>
          <p className="text-left text-lg leading-normal mb-4 text-white font-medium">Nossa metodologia orienta o indivíduo em sua narrativa autobiográfica, ajudando-o a refletir sobre situações passadas, a desenvolver estratégias comportamentais para seus desafios diários, bem como a planejar seu futuro, criando um vínculo de confiança, já na primeira semana de interação.</p>
          <p className="text-left text-lg leading-normal mb-4 text-white font-medium">Nossa IA é programada na abordagem <span className={`${borel.className} tracking-normal`}>Life Design</span> de compreensão de vida e carreira, uma metodologia de intervenção psicológica válida nos 5 continentes.</p>
        </div>
        <div className="overflow-hidden order-2 sm:order-1">
          <Image alt="" className="rounded" src={image}  />
        </div>
      </div>
    </section>
  )
}