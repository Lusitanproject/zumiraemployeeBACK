import Image from "next/image";

import image from "../images/zumira-picture5.png";

export function HowItWorks() {
  return (
    <section className="w-full px-4 py-28 sm:pb-32 bg-background-0">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
        <div className="flex flex-col w-full mb-16 md:mb-0 md:w-5/12">
          <h2 className="text-3xl font-bold leading-[1.25] sm:text-4xl sm:leading-[1.2] mb-6 text-slate-800">
            Como funciona?
          </h2>

          <p className="sm:max-w-[600px] text-slate-600 mb-4">
            Sua empresa contrata a Zumira e disponibiliza gratuitamente aos colaboradores, uma plataforma que acolhe,
            aplica instrumentos psicológicos confiáveis, gera devolutivas automatizadas e, quando necessário, orienta
            ações de desenvolvimento e a busca por profissionais da saúde especializados.
          </p>
          <p className="sm:max-w-[600px] text-slate-600">
            Você recebe acesso a um Dashboard Corporativo exclusivo, que permite acompanhar de forma anonimizada e
            ética, os principais indicadores de riscos psicossociais e saúde emocional de seus colaboradores, entre
            muitas outras funcionalidades estratégicas para a gestão de saúde mental e bem estar da sua organização.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <Image alt="" src={image} />
        </div>
      </div>
    </section>
  );
}
