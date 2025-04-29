import { ChevronRight } from "lucide-react";

import { AppLink } from "../ui";

export function HeroCompany() {
  return (
    <section className="w-full px-4 sm:px-12 pt-[9rem] sm:pb-32 bg-gradient-to-b from-white to-[#f5f5eb]">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col items-start">
        <div className="flex flex-col w-full mb-16 sm:mb-0 text-center items-center">
          <p className="text-slate-400 text-xl font-medium">Para empresas</p>
          <h2 className="text-4xl font-bold leading-[1.25] sm:text-5xl sm:leading-[1.2] mb-6 text-slate-800">Cuidar das pessoas é estratégico. <br />Medir e transformar o clima emocional<br/>da sua empresa também</h2>
          <p className="text-lg leading-normal mb-8 text-slate-700 font-medium max-w-[720px]">Zumira é uma plataforma inteligente com base científica que atua como uma assistente psicológica, promovendo a autoconsciência, rastreando riscos psicossociais e fornecendo às instituições dados confiáveis sobre a saúde mental e o bem-estar dos colaboradores de forma anônima, ética e segura.</p>
          <AppLink
            variant="primary"
            className="w-fit"
            href="/entrar"
          >
            <span className="leading-none mb-1">Acessar plataforma</span>
            <ChevronRight className="size-5 text-white" />
          </AppLink>
        </div>
        <div className="overflow-hidden "></div>
      </div>
    </section>
  )
}