import { ZumiraPicture } from "../images/zumira-picture1";

export function ReceptionAndReferal() {
  return (
    <section className="w-full px-4 py-20 sm:pb-32 bg-white">
      <div className="w-full max-w-[82.5rem] mx-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
        <div className="flex flex-col w-full mb-16 sm:mb-0 sm:w-1/2">
          <h2 className="text-3xl font-bold leading-[1.25] sm:text-4xl sm:leading-[1.2] mb-6 text-slate-800">Acolhimento e<br /> encaminhamentos</h2>
          <p className="text-left text-lg leading-normal mb-4 text-slate-700 font-medium">
            Nosso algorítimo combina o Processamento de
            Linguagem Natural (PNL) com métodos de análise
            psicológica sob supervisão especializada. Nossa
            metodologia atende a demandas avançadas para
            suporte à saúde e bem estar, incluindo Detecção de
            indicadores de risco psicossociais, Análise de
            comportamentos, Intervenções terapêuticas
            automatizadas e Triagem com encaminhamento para
            especialistas.
          </p>
        </div>
        <div className=" w-full sm:w-5/12">
          <ZumiraPicture />
        </div>
      </div>
    </section>
  )
}