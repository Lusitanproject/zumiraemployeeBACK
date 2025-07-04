import { Activity, Brain, Users } from "lucide-react";

export default function RedeApoio() {
  return (
    <div className="flex flex-col w-full h-2/3 justify-center items-center gap-3 text-text-600 text-center">
      <div className="flex flex-col h-full justify-center text-center max-w-[28rem] gap-8">
        <h1 className="text-3xl font-bold">EM BREVE</h1>
        <div className="flex flex-col gap-2 text-lg">
          <p>
            Uma Rede de Apoio que conecta você a ajuda que você precisa. Estamos aqui para integrar ações que irão
            melhorar o seu bem estar, saúde mental e qualidade de vida
          </p>
        </div>
        <div className="flex flex-row gap-10 justify-between text-text-400 mt-10 w-full">
          <div className="flex flex-col items-center text-xs gap-2 font-semibold flex-1">
            <Brain className="w-10 h-10 text-text-300" />
            <span>ATENDIMENTO PSICOLÓGICO</span>
          </div>

          <div className="flex flex-col items-center text-xs gap-2 font-semibold flex-1">
            <Activity className="w-10 h-10 text-text-300" />
            <span>TREINAMENTO PARA GESTÃO DO ESTRESSE</span>
          </div>

          <div className="flex flex-col items-center text-xs gap-2 font-semibold flex-1">
            <Users className="w-10 h-10 text-text-300" />
            <span>GRUPOS DE APOIO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
